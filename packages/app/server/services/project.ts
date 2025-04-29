import type { Project } from '../types'
import React from 'react'
import { z } from 'zod'
import { queries } from '../queries/index.js'
import { sendEmail } from '../emails/index.js'
import { JoinProject } from '../emails/templates/JoinProject.js'
import { executeQuery } from '../utils/db.js'

export const getAllProjects = async (userId: number) => {
  const result = await executeQuery<Project>(queries.project.findAllByUserId, [
    userId,
  ])
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
  project_id: number,
  user_id: number,
  role_id: number
) =>
  await executeQuery(queries.project.createProjectsUsersRolesRelation, [
    project_id,
    user_id,
    role_id,
  ])

export const createInvites = async (emails: string[], projectIds: string[]) =>
  await executeQuery(queries.project.createInvites, [emails, projectIds])

export const sendInvites = async (
  invites: string | undefined,
  projectName: string,
  token: string
) => {
  if (!invites) throw new Error('Invites undefined')

  let emails = invites?.split(',').map((email) => email.trim()) ?? []
  emails = emails.length ? emails : [invites]
  emails = [...new Set(emails)] // removes duplicate emails
  emails = emails.filter((email) => {
    const { success } = z.string().email().safeParse(email)
    return success
  })

  if (!emails.length) return []

  await sendEmail(
    React.createElement(JoinProject, { name: projectName, token }),
    {
      subject: 'Join project',
      to: emails,
    }
  )

  return emails
}
