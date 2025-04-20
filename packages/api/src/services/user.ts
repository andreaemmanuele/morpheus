import bcryptjs from 'bcryptjs'
import { UserStatus } from '@/src/types'
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

export const updateUserStatus = async (status: UserStatus, userId: string) => {
  const result = await executeQuery(queries.auth.updateUserStatus, [
    status,
    userId,
  ])
  return result.rows[0]
}

export const updateLastLogin = async (userId: string) =>
  await executeQuery(queries.auth.updateLastLogin, [userId])

export const incrementLoginAttempts = async (userId: string) => {
  const result = await executeQuery(queries.auth.incrementLoginAttempts, [
    userId,
  ])
  return result.rows[0]
}

export const validatePassword = async (
  plainPassword: string,
  hashedPassword: string
) => await bcryptjs.compare(plainPassword, hashedPassword)

export const generatePasswordHash = async (password: string) =>
  await bcryptjs.hash(password, 10)
