import { queries } from '../queries/index.js'
import { executeQuery } from '../utils/db.js'
import { generateRandomToken } from '../utils/tokens.js'
export const createRefreshToken = async (userId) => {
  const token = generateRandomToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  await executeQuery(queries.auth.createRefreshToken, [
    userId,
    token,
    expiresAt,
  ])
  return token
}
export const findRefreshToken = async (token) => {
  const result = await executeQuery(queries.auth.findRefreshToken, [token])
  return result.rows[0]
}
export const revokeRefreshToken = async (token) =>
  await executeQuery(queries.auth.revokeRefreshToken, [token])
