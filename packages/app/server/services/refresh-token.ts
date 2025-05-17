import type { Token } from '@/server/types'
import { queries } from '@/server/queries'
import { executeQuery } from '@/server/utils/db'
import { generateRandomToken } from '@/server/utils/tokens'

export const createRefreshToken = async (userId: number) => {
  const token = generateRandomToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const result = await executeQuery<Token>(queries.auth.createRefreshToken, [
    userId,
    token,
    expiresAt,
  ])

  return result.rows[0]
}

export const findRefreshToken = async (token: string) => {
  const result = await executeQuery<Token>(queries.auth.findRefreshToken, [
    token,
  ])
  return result.rows[0]
}

export const findRefreshTokenByUserId = async (userId: number) => {
  const result = await executeQuery<Token>(
    queries.auth.findRefreshTokenByUserId,
    [userId]
  )
  return result.rows[0]
}

export const revokeRefreshToken = async (token: string) =>
  await executeQuery(queries.auth.revokeRefreshToken, [token])
