import bcryptjs from 'bcryptjs'
import { executeQuery } from '@/src/utils/db'
import { queries } from '@/src/queries'

export const findUserByEmail = async (email: string) => {
  const result = await executeQuery(queries.auth.findUserByEmail, [email])
  return result.rows[0]
}

export const findUserById = async (id: string) => {
  const result = await executeQuery(queries.auth.findUserById, [id])
  return result.rows[0]
}

export const updateLastLogin = async (userId: string) =>
  await executeQuery(queries.auth.updateLastLogin, [userId])

export const incrementLoginAttempts = async (userId: string) =>
  await executeQuery(queries.auth.incrementLoginAttempts, [userId])

export const validatePassword = async (
  plainPassword: string,
  hashedPassword: string
) => await bcryptjs.compare(plainPassword, hashedPassword)

export const generatePasswordHash = async (password: string) =>
  await bcryptjs.hash(password, 10)
