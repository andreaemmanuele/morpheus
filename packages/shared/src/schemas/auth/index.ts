import { z } from 'zod'
import { passwordStrengthRegex } from '../../utils/regex.ts'

// eslint-disable-next-line
const validatePasswordStrength = (schema: z.ZodObject<any>) =>
  schema.refine(({ password }) => passwordStrengthRegex.test(password), {
    message:
      'The password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
    path: ['password'],
  })

export const passwordSchema = validatePasswordStrength(
  z.object({
    password: z.string(),
  })
)

export const changePasswordSchema = validatePasswordStrength(
  z.object({
    password: z.string(),
    confirmPassword: z.string(),
  })
).refine(({ password, confirmPassword }) => password === confirmPassword, {
  message: "Passwords don't match",
})
