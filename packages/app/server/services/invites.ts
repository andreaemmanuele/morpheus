import type { Invite } from '../types'
import React from 'react'
import { z } from 'zod'
import { queries } from '@/server/queries'
import { sendEmail } from '@/server/emails'
import { JoinProject } from '@/server/emails/templates/JoinProject'
import { executeQuery } from '@/server/utils/db'
import { generateRandomToken } from '@/server/utils/tokens'

export const getExistingInvites = async (emails: string[]) => {
  const result = await executeQuery<Invite>(
    queries.invites.getExistingInvites,
    [emails]
  )
  return result.rows
}

export const findInviteByToken = async (token: string) => {
  const result = await executeQuery<Invite>(queries.invites.findInviteByToken, [
    token,
  ])
  return result.rows[0]
}

export const createInvites = async (
  emails: string[],
  tokens: string[],
  userIds: number[],
  projectIds: string[]
) =>
  await executeQuery(queries.invites.createInvites, [
    emails,
    tokens,
    userIds,
    projectIds,
  ])

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

export const revokeInviteByToken = async (token: string) =>
  await executeQuery(queries.invites.revokeInviteByToken, [token])

export const revokeInviteByUserId = async (projectId: number, userId: number) =>
  await executeQuery(queries.invites.revokeInviteByUserId, [projectId, userId])
