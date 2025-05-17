import { z } from 'zod'

export const invitesSchema = z.object({
  slug: z.string(),
  projectName: z.string(),
  invites: z.string(),
})
