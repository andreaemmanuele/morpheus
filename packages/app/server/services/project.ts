import type { Project } from '../types'
import React from 'react'
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

export const sendInvites = async (invites: string | undefined) => {
  if (!invites) throw new Error('Invites undefined')
  const emails = invites ? invites.split(',') : []
  if (!emails.length && invites) emails.push(invites) // single email

  await sendEmail(React.createElement(JoinProject), {
    subject: 'Join project',
    to: emails,
  })

  return emails
}
