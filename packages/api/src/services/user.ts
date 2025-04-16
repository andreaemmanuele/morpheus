import bcryptjs from 'bcryptjs'
import { connect } from '@/src/utils/db.js'
import { queries } from '@/src/queries/index.js'

const { client } = await connect()

export const findUserByEmail = async (email: string) => {
  const result = await client.query(queries.auth.findUserByEmail, [email])
  return result.rows[0]
}

export const findUserById = async (id: string) => {
  const result = await client.query(queries.auth.findUserById, [id])
  return result.rows[0]
}

export const updateLastLogin = async (userId: string) =>
  await client.query(queries.auth.updateLastLogin, [userId])

export const incrementLoginAttempts = async (userId: string) =>
  await client.query(queries.auth.incrementLoginAttempts, [userId])

export const validatePassword = async (
  plainPassword: string,
  hashedPassword: string
) => await bcryptjs.compare(plainPassword, hashedPassword)

export const generatePasswordHash = async (password: string) =>
  await bcryptjs.hash(password, 10)
