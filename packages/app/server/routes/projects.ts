import type { FastifyInstance } from 'fastify'
import type { User } from '@/server/types'
import bcryptjs from 'bcryptjs'
import {
  associateFilesToProject,
  checkIfMemberExists,
  createProject,
  createProjectsUsersRolesRelation,
  createTeamMembers,
  deleteProject,
  deleteTeamMember,
  getAllProjects,
  getFilesByCategory,
  getProject,
  getProjectIdBySlug,
  getProjectTeam,
  getUniqueSlug,
  getUserRole,
  updateProject,
  updateUserRole,
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
  projectDetailsSchema,
  createProjectSchema,
  getMemberSchema,
  getProjectSchema,
  joinProjectSchema,
  getProjectIdSchema,
  checkInviteSchema,
  transferProjectSchema,
  updateMemberRoleSchema,
  filesProjectSchema,
  getProjectFilesSchema,
} from '@/server/schemas/project'
import { invitesSchema } from '@/server/schemas/invites'
import { changePasswordSchema } from '@morphe.us/shared/schemas'
import { authenticate } from '@/server/utils/auth'
import { hasPermission } from '@/server/utils/permission'

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

  fastify.get('/projects/:id/check-invite/:token', async (request, reply) => {
    const { id, token } = checkInviteSchema.parse(request.params)
    try {
      const invite = await findInviteByToken(token)
      if (!invite) {
        reply.code(500).send({ error: 'Internal Server Error' })
        return
      }
      const user = await findUserByEmail(invite.email)
      if (user && user.status === 'active') {
        await Promise.all([
          createProjectsUsersRolesRelation(+id, user.id, 3),
          revokeInviteByToken(token),
        ])
        reply.redirect('/login?message=project-joined')
      }
      reply.redirect(`/projects/${id}/join/${token}`)
    } catch (error) {
      console.error(error)
      reply.code(500).send({ error: 'Internal Server Error' })
    }
  })

  fastify.get(
    '/projects/:slug/files/:category',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { slug, category } = getProjectFilesSchema.parse(request.params)

      try {
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Internal Server Error' })
          return
        }
        const files = await getFilesByCategory(project.id, category)
        reply.code(200).send(files)
      } catch (error) {
        console.error(error)
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
        return
      }

      if (!invites) return project

      try {
        const { validEmails, tokens } = await sendInvites(
          invites,
          project.id,
          project?.name ?? ''
        )

        if (!validEmails.length) return project
        const userIds = await createTeamMembers(validEmails)
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
    '/projects/:slug/invite',
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
      const { slug } = getProjectSchema.parse(request.params)
      const { projectName, invites } = invitesSchema.parse(
        JSON.parse(request.body as string)
      )
      try {
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Internal Server Error' })
          return
        }
        await hasPermission(request, reply, 'users.invite', project.id)

        const user = await findUserByEmail(invites)
        const alreadyExists =
          user && (await checkIfMemberExists(project.id, user.id))

        if (alreadyExists) {
          reply.code(409).send({ error: 'User is already member' })
          return
        }

        const { validEmails, tokens } = await sendInvites(
          invites,
          project.id,
          projectName
        )
        const userIds = await createTeamMembers(validEmails)
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

  fastify.post('/projects/:id/join', async (request, reply) => {
    const { id } = getProjectIdSchema.parse(request.params)
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
        createProjectsUsersRolesRelation(+id, user.id, 3),
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

  fastify.post(
    '/projects/:slug/files',
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { slug } = getProjectSchema.parse(request.params)
        const { fileIds, category } = filesProjectSchema.parse(
          JSON.parse(request.body as string)
        )
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Project not found' })
          return
        }
        await associateFilesToProject(
          Array(fileIds.length).fill(project.id),
          fileIds,
          category
        )
        reply.code(200).send({ message: 'Files associated successfully' })
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Internal Server Error' })
      }
    }
  )

  fastify.patch(
    '/projects/:slug/update',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { slug } = getProjectSchema.parse(request.params)
      const { icon, picture, name } = projectDetailsSchema.parse(
        JSON.parse(request.body as string)
      )
      try {
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Project not found' })
          return
        }
        await hasPermission(request, reply, 'project.update', project.id)
        await updateProject(project.id, icon, picture, name)
        reply.code(200).send({ message: 'Project updated successfully' })
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Cannot update project' })
      }
    }
  )

  fastify.patch(
    '/projects/:slug/update-role',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { slug } = getProjectSchema.parse(request.params)
      const { roleId, userId } = updateMemberRoleSchema.parse(
        JSON.parse(request.body as string)
      )
      const token = fastify.jwt.lookupToken(request)
      const user = fastify.jwt.decode<User>(token)
      if (!user) {
        reply.code(400).send({ error: 'Bad Request' })
        return
      }

      try {
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Project not found' })
          return
        }
        await hasPermission(request, reply, 'users.update_roles', project.id)
        const [userRole, updatedMemberRole] = await Promise.all([
          getUserRole(project.id, user.id),
          getUserRole(project.id, +userId),
        ])
        if (!userRole || !updatedMemberRole) {
          reply.code(500).send({ error: 'Cannot find user role' })
          return
        }
        if (
          userRole.id === updatedMemberRole.id ||
          userRole.id > updatedMemberRole.id
        ) {
          reply.code(403).send({ error: 'User cannot update role' })
          return
        }
        await updateUserRole(+roleId, project.id, +userId)
        reply.code(200).send({ message: 'Role updated successfully' })
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Cannot transfer project ownership' })
      }
    }
  )

  fastify.patch(
    '/projects/:slug/transfer',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { slug } = getProjectSchema.parse(request.params)
      const { userId } = transferProjectSchema.parse(
        JSON.parse(request.body as string)
      )
      const token = fastify.jwt.lookupToken(request)
      const user = fastify.jwt.decode<User>(token)
      if (!user) {
        reply.code(400).send({ error: 'Bad Request' })
        return
      }

      try {
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Project not found' })
          return
        }
        await hasPermission(request, reply, 'project.transfer', project.id)
        await Promise.all([
          updateUserRole(3, project.id, user.id), // owner becomes editor
          updateUserRole(1, project.id, +userId), // user becomes owner
        ])
        reply.code(200).send({ message: 'Project transferred successfully' })
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Cannot transfer project ownership' })
      }
    }
  )

  fastify.delete(
    '/projects/:slug/leave',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { slug } = getProjectSchema.parse(request.params)
      try {
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Project not found' })
          return null
        }
        await hasPermission(request, reply, 'project.leave', project.id)
        await deleteTeamMember(project.id, request.user.id)
        reply.code(200).send({ message: 'Project left successfully' })
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Internal Server Error' })
      }
    }
  )

  fastify.delete(
    '/projects/:slug/member/:id',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { slug, id: userId } = getMemberSchema.parse(request.params)
      try {
        const project = await getProjectIdBySlug(slug)
        if (!project) {
          reply.code(500).send({ error: 'Project not found' })
          return null
        }
        await hasPermission(request, reply, 'users.remove', project.id)
        await Promise.allSettled([
          revokeInviteByUserId(project.id, +userId),
          deleteTeamMember(project.id, +userId),
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
        await hasPermission(request, reply, 'project.delete', project.id)
        await deleteProject(project.id)
        reply.code(200).send('Project deleted successfully')
      } catch (error) {
        console.error(error)
        reply.code(500).send({ error: 'Cannot delete project' })
      }
    }
  )
}
