import { z } from 'zod'

export const getFilesIdsSchema = z.object({
  fileIds: z.array(z.string()),
})
