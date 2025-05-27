import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.string(),
  limit: z.string(),
})
