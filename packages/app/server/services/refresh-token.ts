import type { Token } from '../types'
import { queries } from '../queries/index.js'
import { executeQuery } from '../utils/db.js'
import { generateRandomToken } from '../utils/tokens.js'

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
