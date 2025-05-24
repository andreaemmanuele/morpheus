import { z } from 'zod'
import slugify from 'slugify'

export const getProjectSchema = z.object({
  slug: z.string(),
})

export const getProjectIdSchema = z.object({
  id: z.string(),
})

export const projectDetailsSchema = z.object({
  icon: z.string().optional().nullable(),
  picture: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
})

export const createProjectSchema = z
  .object({
    icon: z.string(),
    name: z.string(),
    slug: z.string(),
    invites: z.string().optional(),
  })
  .refine(({ name, slug }) => slugify(name, { lower: true }) === slug, {
    message: "Name and slug don't match the pattern",
    path: ['slug'],
  })

export const checkInviteSchema = z.object({
  id: z.string(),
  token: z.string(),
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

export const updateMemberRoleSchema = z.object({
  roleId: z.string(),
  userId: z.string(),
})

export const transferProjectSchema = z.object({
  userId: z.string(),
})

export const filesProjectSchema = z.object({
  fileIds: z.array(z.number()),
  category: z.string(),
})
