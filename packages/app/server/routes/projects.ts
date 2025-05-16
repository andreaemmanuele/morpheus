import type { FastifyInstance } from 'fastify'
import type { User } from '../types'
import { authenticate } from '../utils/auth.js'
import {
  createInvites,
  createProject,
  createProjectsUsersRolesRelation,
  createTeamMembers,
  deleteProject,
  getAllProjects,
  getProject,
  getProjectIdBySlug,
  getProjectTeam,
  getUniqueSlug,
  sendInvites,
} from '../services/project.js'
import {
  createProjectSchema,
  getProjectSchema,
  invitesSchema,
} from '../schemas/project.js'
import { generateRandomToken } from '../utils/tokens'

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

  fastify.get(
    '/projects/:slug',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { slug } = getProjectSchema.parse(request.params)
      const token = fastify.jwt.lookupToken(request)
      const user = fastify.jwt.decode<User>(token)
      if (!user) {
        reply.code(400).send({ error: 'Bad Request' })
        return
      }

      try {
        const project = await getProject(slug, user.id)
        reply.code(200).send(project)
      } catch (e) {
        console.error(e)
        reply.code(500).send({ error: 'Internal Server Error' })
      }
    }
  )

  fastify.get(
    '/projects/:slug/team',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { slug } = getProjectSchema.parse(request.params)
      try {
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Internal Server Error' })
          return
        }
        const members = await getProjectTeam(project.id)
        reply.code(200).send(members)
      } catch (e) {
        console.error(e)
        reply.code(500).send({ error: 'Internal Server Error' })
      }
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
      const { icon, name, slug, invites, isDefault } =
        createProjectSchema.parse(JSON.parse(request.body as string))

      const token = fastify.jwt.lookupToken(request)
      const user = fastify.jwt.decode<User>(token)
      if (!user) {
        reply.code(400).send({ error: 'Bad Request' })
        return
      }

      let project
      try {
        const _slug = await getUniqueSlug(user.id, slug)
        project = await createProject(icon, name, _slug!, user.id, isDefault)
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
        const token = generateRandomToken()
        const emails = await sendInvites(invites, project?.name ?? '', token)
        if (!emails.length) return project
        await Promise.all([
          createInvites(emails, Array(emails.length).fill(project?.id)),
          createTeamMembers(project?.id, emails),
        ])
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
      const { slug, projectName, invites } = invitesSchema.parse(
        JSON.parse(request.body as string)
      )

      try {
        const token = generateRandomToken()
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Internal Server Error' })
        }
        const emails = await sendInvites(invites, projectName, token)
        await Promise.all([
          createInvites(emails, Array(emails.length).fill(project?.id)),
          createTeamMembers(project?.id, emails),
        ])
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Cannot send invites' })
      }

      reply.code(200).send({ message: 'Invited successfully' })
    }
  )

  fastify.delete('/projects/:slug', async (request, reply) => {
    const { slug } = getProjectSchema.parse(request.params)
    try {
      const project = await getProjectIdBySlug(slug)
      if (!project) {
        reply.code(500).send({ error: 'Internal Server Error' })
        return
      }
      await deleteProject(project.id)
      reply.code(200).send('Project deleted successfully')
    } catch (error) {
      console.error(error)
      reply.code(500).send({ error: 'Cannot delete project' })
    }
  })
}
