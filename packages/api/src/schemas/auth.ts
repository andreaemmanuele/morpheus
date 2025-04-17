import { z } from 'zod'

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
})
