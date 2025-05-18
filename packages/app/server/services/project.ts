import type {
  Project,
  ProjectWithRoleUserRelation,
  TeamMember,
  User,
} from '@/server/types'
import crypto from 'crypto'
import { queries } from '@/server/queries'
import { createUser, generatePasswordHash } from '@/server/services/user'
import { executeQuery } from '@/server/utils/db.js'

export const getAllProjects = async (userId: number) => {
  const result = await executeQuery<ProjectWithRoleUserRelation>(
    queries.project.findAllByUserId,
    [userId]
  )
  return result.rows
}

export const getProject = async (slug: string, userId: number) => {
  const result = await executeQuery<Project>(
    queries.project.findProjectBySlugAndUserId,
    [userId, slug]
  )
  return result.rows[0]
}

export const getProjectIdBySlug = async (slug: string) => {
  const result = await executeQuery<{ id: number }>(
    queries.project.getProjectIdBySlug,
    [slug]
  )
  return result.rows[0]
}

export const getProjectTeam = async (projectId: number) => {
  const result = await executeQuery<TeamMember>(
    queries.project.getProjectTeam,
    [projectId]
  )
  return result.rows
}

export const getUniqueSlug = async (slug: string) => {
  const originalSlug = slug
  let counter = 1
  let slugExists = true

  while (slugExists) {
    const result = await executeQuery<Project>(
      queries.project.findProjectBySlug,
      [slug]
    )
    const project = result.rows[0]
    slugExists = !!project

    if (!slugExists) return slug
    slug = `${originalSlug}-${counter}`
    counter++
  }
}

export const createProject = async (
  icon: string,
  name: string,
  slug: string
) => {
  const result = await executeQuery<Project>(queries.project.createProject, [
    icon,
    name,
    slug,
  ])
  return result.rows[0]
}

export const createProjectsUsersRolesRelation = async (
  project_id: number | null,
  user_id: number,
  role_id: number,
  isDefault?: boolean
) =>
  await executeQuery(queries.project.createProjectsUsersRolesRelation, [
    project_id,
    user_id,
    role_id,
    isDefault,
  ])

export const createTeamMembers = async (
  projectId: number | undefined,
  emails: string[]
) => {
  const tempUsers: Promise<User | undefined>[] = []
  for (const email of emails) {
    const passwordHash = await generatePasswordHash(
      crypto.randomBytes(15).toString('base64')
    )
    // add a check if user already exists and is active, then push into tempUsers
    tempUsers.push(
      createUser({
        email,
        username: null,
        password_hash: passwordHash,
        email_verified: false,
        status: 'pending',
      })
    )
  }
  const result = await Promise.allSettled([...tempUsers])
  const userIds: number[] = []
  for (const user of result) {
    if (user.status !== 'fulfilled') {
      console.log(user.reason)
      continue
    }
    if (user.value) userIds.push(user.value.id)
  }
  await Promise.allSettled(
    userIds.map((id) =>
      createProjectsUsersRolesRelation(projectId ?? null, id, 3)
    )
  )
  return userIds
}

export const deleteTeamMember = async (projectId: number, userId: number) =>
  await executeQuery(queries.project.deleteMember, [projectId, userId])

export const deleteProject = async (id: number) =>
  await executeQuery(queries.project.deleteProject, [id])
