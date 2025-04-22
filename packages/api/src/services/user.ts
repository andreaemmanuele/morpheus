import type { LoginAttempts, User, UserStatus } from '@/src/types'
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

export const findUserBySuspendedToken = async (token: string) => {
  const result = await executeQuery<User>(
    queries.auth.findUserBySuspendedToken,
    [token]
  )
  return result.rows[0]
}

export const updateUserStatus = async (status: UserStatus, userId: number) =>
  await executeQuery(queries.auth.updateStatus, [status, userId])

export const updateSuspendedToken = async (
  token: string | null,
  userId: number
) => await executeQuery(queries.auth.updateSuspendedToken, [token, userId])

export const updateLastLogin = async (userId: number) =>
  await executeQuery(queries.auth.updateLastLogin, [userId])

export const incrementLoginAttempts = async (userId: number) => {
  const result = await executeQuery<LoginAttempts>(
    queries.auth.incrementLoginAttempts,
    [userId]
  )
  return result.rows[0]
}

export const resetLoginAttempts = async (userId: number) =>
  await executeQuery(queries.auth.resetLoginAttempts, [userId])

export const validatePassword = async (
  plainPassword: string,
  hashedPassword: string
) => await bcryptjs.compare(plainPassword, hashedPassword)

export const generatePasswordHash = async (password: string) =>
  await bcryptjs.hash(password, 10)
