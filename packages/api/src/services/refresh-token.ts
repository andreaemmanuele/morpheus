import type { Token } from '@/src/types'
import { queries } from '@/src/queries'
import { executeQuery } from '@/src/utils/db'
import { generateRandomToken } from '@/src/utils/tokens'

export const createRefreshToken = async (userId: number) => {
  const token = generateRandomToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await executeQuery(queries.auth.createRefreshToken, [
    userId,
    token,
    expiresAt,
  ])

  return token
}

export const findRefreshToken = async (token: string) => {
  const result = await executeQuery<Token>(queries.auth.findRefreshToken, [
    token,
  ])
  return result.rows[0]
}

export const revokeRefreshToken = async (token: string) =>
  await executeQuery(queries.auth.revokeRefreshToken, [token])
