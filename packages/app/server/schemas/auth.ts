import { z } from 'zod'

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
})

export const recoveryPasswordSchema = z.object({
  email: z.string(),
})

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
})

export const unlockAccountSchema = z.object({
  token: z.string(),
})
