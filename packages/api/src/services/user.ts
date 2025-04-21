import { LoginAttempts, User, UserStatus } from '@/src/types'
import bcryptjs from 'bcryptjs'
import { executeQuery } from '@/src/utils/db'
import { queries } from '@/src/queries'

export const findUserByEmail = async (email: string) => {
  const result = await executeQuery<User>(queries.auth.findUserByEmail, [email])
  return result.rows[0]
}

export const findUserById = async (id: number) => {
  const result = await executeQuery<User>(queries.auth.findUserById, [id])
  return result.rows[0]
}

export const updateUserStatus = async (status: UserStatus, userId: number) =>
  await executeQuery(queries.auth.updateUserStatus, [status, userId])

export const updateLastLogin = async (userId: number) =>
  await executeQuery(queries.auth.updateLastLogin, [userId])

export const incrementLoginAttempts = async (userId: number) => {
  const result = await executeQuery<LoginAttempts>(
    queries.auth.incrementLoginAttempts,
    [userId]
  )
  return result.rows[0]
}

export const validatePassword = async (
  plainPassword: string,
  hashedPassword: string
) => await bcryptjs.compare(plainPassword, hashedPassword)

export const generatePasswordHash = async (password: string) =>
  await bcryptjs.hash(password, 10)
