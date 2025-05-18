import { z } from 'zod'
import slugify from 'slugify'

export const getProjectSchema = z.object({
  slug: z.string(),
})

export const createProjectSchema = z
  .object({
    icon: z.string(),
    name: z.string(),
    slug: z.string(),
    isDefault: z.boolean().optional(),
    invites: z.string().optional(),
  })
  .refine(({ name, slug }) => slugify(name, { lower: true }) === slug, {
    message: "Name and slug don't match the pattern",
    path: ['slug'],
  })

export const joinProjectSchema = z.object({
  token: z.string(),
  username: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
})

export const getMemberSchema = z.object({
  id: z.string(),
  slug: z.string(),
})
