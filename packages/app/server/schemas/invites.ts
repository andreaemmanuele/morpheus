import { z } from 'zod'

export const invitesSchema = z.object({
  projectName: z.string(),
  invites: z.string(),
})
