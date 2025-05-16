import type { Invite, Project, TeamMember, User } from '../types'
import React from 'react'
import crypto from 'crypto'
import { z } from 'zod'
import { queries } from '../queries/index.js'
import { sendEmail } from '../emails/index.js'
import { JoinProject } from '../emails/templates/JoinProject.js'
import { executeQuery } from '../utils/db.js'
import {
  createUser,
  generatePasswordHash,
  updateResetTokenAndExpiration,
} from './user'
import { generateRandomToken } from '../utils/tokens'

export const getAllProjects = async (userId: number) => {
  const result = await executeQuery<Project>(queries.project.findAllByUserId, [
    userId,
  ])
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

export const getUniqueSlug = async (userId: number, slug: string) => {
  const originalSlug = slug
  let counter = 1
  let slugExists = true

  while (slugExists) {
    const result = await executeQuery<Project>(
      queries.project.findProjectBySlugAndUserId,
      [userId, slug]
    )
    const project = result.rows[0]
    slugExists = !!project

    if (!slugExists) return slug
    slug = `${originalSlug}-${counter}`
    counter++
  }
}

export const getExistingInvites = async (emails: string[]) => {
  const result = await executeQuery<Invite>(
    queries.project.getExistingInvites,
    [emails]
  )
  return result.rows
}

export const createProject = async (
  icon: string,
  name: string,
  slug: string,
  userId: number,
  isDefault?: boolean
) => {
  const result = await executeQuery<Project>(queries.project.createProject, [
    icon,
    name,
    slug,
    isDefault,
    userId,
  ])
  return result.rows[0]
}

export const createProjectsUsersRolesRelation = async (
  project_id: number | null,
  user_id: number,
  role_id: number
) =>
  await executeQuery(queries.project.createProjectsUsersRolesRelation, [
    project_id,
    user_id,
    role_id,
  ])

export const createInvites = async (
  emails: string[],
  tokens: string[],
  projectIds: string[]
) =>
  await executeQuery(queries.project.createInvites, [
    emails,
    tokens,
    projectIds,
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
  await Promise.allSettled([
    userIds
      .map((id) => [
        updateResetTokenAndExpiration(generateRandomToken(), id),
        createProjectsUsersRolesRelation(projectId ?? null, id, 3),
      ])
      .flat(),
  ])
}

export const sendInvites = async (
  invites: string | undefined,
  projectName: string
) => {
  if (!invites) throw new Error('Invites undefined')

  let emails = invites?.split(',').map((email) => email.trim()) ?? []
  emails = emails.length ? emails : [invites]
  emails = [...new Set(emails)] // removes duplicate emails
  emails = emails.filter((email) => {
    const { success } = z.string().email().safeParse(email)
    return success
  })

  if (!emails.length) return { validEmails: [], tokens: [] }

  const existingInvites = await getExistingInvites(emails)
  const validEmails = emails.filter(
    (email) => !existingInvites.some((invite) => invite.email === email)
  )

  if (!validEmails.length) return { validEmails: [], tokens: [] }

  const tokens = validEmails.map(() => generateRandomToken())
  await Promise.allSettled(
    validEmails.map((email, index) =>
      sendEmail(
        React.createElement(JoinProject, {
          name: projectName,
          token: tokens[index] ?? '',
        }),
        {
          subject: 'Join project',
          to: [email],
        }
      )
    )
  )

  return { validEmails, tokens }
}

export const deleteProject = async (id: number) =>
  await executeQuery(queries.project.deleteProject, [id])
