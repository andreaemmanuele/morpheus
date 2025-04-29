import type { FastifyInstance } from 'fastify'
import type { User } from '../types'
import { authenticate } from '../utils/auth.js'
import {
  createInvites,
  createProject,
  createProjectsUsersRolesRelation,
  getAllProjects,
  getUniqueSlug,
  sendInvites,
} from '../services/project.js'
import { createProjectSchema, invitesSchema } from '../schemas/project.js'

export default async function projectRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/projects',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const token = fastify.jwt.lookupToken(request)
      const user = fastify.jwt.decode<User>(token)
      if (!user) {
        reply.code(400).send({ error: 'Bad Request' })
        return
      }

      const projects = await getAllProjects(user.id)
      reply.code(200).send(projects)
    }
  )

  fastify.post(
    '/projects/create',
    {
      onRequest: [authenticate],
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '15 minutes',
        },
      },
    },
    async (request, reply) => {
      const { icon, name, slug, invites } = createProjectSchema.parse(
        JSON.parse(request.body as string)
      )

      const token = fastify.jwt.lookupToken(request)
      const user = fastify.jwt.decode<User>(token)
      if (!user) {
        reply.code(400).send({ error: 'Bad Request' })
        return
      }

      let project
      try {
        const _slug = await getUniqueSlug(slug)
        project = await createProject(icon, name, _slug!)
        if (!project) {
          reply.code(500).send({ error: 'Internal Server Error' })
          return
        }
        await createProjectsUsersRolesRelation(project.id, user.id, 1)
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Cannot create project' })
      }

      if (!invites) return project

      try {
        const token = '' // add access token to invite
        const emails = await sendInvites(invites, project?.name ?? '', token)
        if (!emails.length) return project
        await createInvites(emails, Array(emails.length).fill(project?.id))
      } catch (error) {
        console.error(error)
        reply
          .code(500)
          .send({ error: 'Project created but cannot send invites' })
        return project
      }

      return project
    }
  )

  fastify.post(
    '/projects/invite',
    {
      onRequest: [authenticate],
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '15 minutes',
        },
      },
    },
    async (request, reply) => {
      const { invites, projectId } = invitesSchema.parse(
        JSON.parse(request.body as string)
      ) // adds project name

      try {
        const token = ''
        const emails = await sendInvites(invites, '', token)
        await createInvites(emails, Array(emails.length).fill(projectId))
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Cannot send invites' })
      }

      reply.code(200).send(`Invites sent successfully`)
    }
  )
}
