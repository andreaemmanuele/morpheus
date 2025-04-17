import crypto from 'crypto'
import { connect } from '@/src/utils/db'
import { queries } from '@/src/queries'

const { client } = await connect()

export const createRefreshToken = async (userId: string) => {
  const token = crypto.randomBytes(40).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await client.query(queries.auth.createRefreshToken, [
    userId,
    token,
    expiresAt,
  ])

  return token
}

export const findRefreshToken = async (token: string) => {
  const result = await client.query(queries.auth.findRefreshToken, [token])
  return result.rows[0]
}

export const revokeRefreshToken = async (token: string) =>
  await client.query(queries.auth.revokeRefreshToken, [token])
