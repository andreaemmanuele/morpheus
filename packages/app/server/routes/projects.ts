import type { FastifyInstance } from 'fastify'
import type { User } from '@/server/types'
import bcryptjs from 'bcryptjs'
import {
  createProject,
  createProjectsUsersRolesRelation,
  createTeamMembers,
  deleteProject,
  deleteTeamMember,
  getAllProjects,
  getProject,
  getProjectIdBySlug,
  getProjectTeam,
  getUniqueSlug,
} from '@/server/services/project'
import {
  createInvites,
  findInviteByToken,
  sendInvites,
  revokeInviteByToken,
  revokeInviteByUserId,
} from '@/server/services/invites'
import {
  findUserByEmail,
  updatePassword,
  updateUsername,
  updateUserStatus,
} from '@/server/services/user'
import {
  createProjectSchema,
  getMemberSchema,
  getProjectSchema,
  joinProjectSchema,
} from '@/server/schemas/project'
import { invitesSchema } from '@/server/schemas/invites'
import { changePasswordSchema } from '@morphe.us/shared/schemas'
import { authenticate } from '@/server/utils/auth'
import { checkPermission } from '@/server/services/permissions'

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
        return
      }

      if (!invites) return project

      try {
        const { validEmails, tokens } = await sendInvites(
          invites,
          project?.name ?? ''
        )

        if (!validEmails.length) return project
        const userIds = await createTeamMembers(project?.id, validEmails)
        await createInvites(
          validEmails,
          tokens,
          userIds,
          Array(validEmails.length).fill(project?.id)
        )
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
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Internal Server Error' })
        }
        const { validEmails, tokens } = await sendInvites(invites, projectName)
        const userIds = await createTeamMembers(project?.id, validEmails)
        await createInvites(
          validEmails,
          tokens,
          userIds,
          Array(validEmails.length).fill(project?.id)
        )
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Cannot send invites' })
      }

      reply.code(200).send({ message: 'Invited successfully' })
    }
  )

  fastify.post('/projects/join', async (request, reply) => {
    const { token, username, password, confirmPassword } =
      joinProjectSchema.parse(JSON.parse(request.body as string))

    const { error: validationError } = changePasswordSchema.safeParse({
      password,
      confirmPassword,
    })

    if (validationError) {
      reply.code(400).send({ error: validationError.errors[0]?.message })
    }

    try {
      const invite = await findInviteByToken(token)
      if (!invite) {
        reply.code(401).send({ error: 'Token expired' })
        return
      }

      const user = await findUserByEmail(invite.email)
      if (!user) {
        reply.code(500).send({ error: "User doesn't exists" })
        return
      }

      const passwordHash = await bcryptjs.hash(password, 10)
      await Promise.all([
        updateUsername(username, user.id),
        updatePassword(passwordHash, user.id),
        updateUserStatus('active', user.id),
        revokeInviteByToken(token),
      ])
      return { message: 'Project joined successfully' }
    } catch (error) {
      console.error(error)
      const err = error as { constraint: string }
      reply.code(500).send({
        error:
          err.constraint === 'users_username_key'
            ? 'Username already exists'
            : 'Internal Server Error',
      })
      return
    }
  })

  fastify.delete(
    '/projects/member/:id',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { id } = getMemberSchema.parse(request.params)
      try {
        await Promise.allSettled([
          revokeInviteByUserId(+id),
          deleteTeamMember(+id),
        ])
        reply.code(200).send({ message: 'Member deleted successfully' })
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Cannot delete member' })
      }
    }
  )

  fastify.delete(
    '/projects/:slug',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { slug } = getProjectSchema.parse(request.params)
      try {
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Missing project id' })
          return
        }
        const hasPermission = await checkPermission(
          request.user.id,
          project.id,
          'project.delete'
        )
        if (!hasPermission) {
          reply.code(403).send({ error: 'Forbidden' })
          return
        }
        await deleteProject(project.id)
        reply.code(200).send('Project deleted successfully')
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Cannot delete project' })
      }
    }
  )
}
