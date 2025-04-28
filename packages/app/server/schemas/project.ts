import { z } from 'zod'
import slugify from 'slugify'

//eslint-disable-next-line
const validateInvites = (schema: z.ZodObject<any>) =>
  schema.refine(
    ({ invites }) => {
      const { success } = z.string().email().safeParse(invites)
      if (!success) return !success
      const emails = invites ? invites.split(',') : []
      return !emails.length
    },
    {
      message: 'Email or emails are not valid',
      path: ['invites'],
    }
  )

export const createProjectSchema = validateInvites(
  z.object({
    icon: z.string(),
    name: z.string(),
    slug: z.string(),
    invites: z.string().optional(),
  })
).refine(({ name, slug }) => slugify(name, { lower: true }) === slug, {
  message: "Name and slug don't match the pattern",
  path: ['slug'],
})

export const invitesSchema = validateInvites(
  z.object({
    invites: z.string(),
    projectId: z.number(),
  })
)
