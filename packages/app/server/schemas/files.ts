import type { ZodObject } from 'zod'
import { z } from 'zod'
import { getFileType, SIZE_LIMITS } from '@/server/utils/file-system'

const checkFileSize = (data: ZodObject<any>) =>
  data.refine(
    (file) => {
      const fileType = getFileType(file.type)
      const maxSize = SIZE_LIMITS[fileType]
      return file.size <= maxSize
    },
    (file) => {
      const fileType = getFileType(file.type)
      const maxSizeMB = Math.round(SIZE_LIMITS[fileType] / (1024 * 1024))
      return {
        message: `${fileType} files must be less than ${maxSizeMB}MB`,
      }
    }
  )

export const getFilesIdsSchema = z.object({
  fileIds: z.array(z.string()),
})

export const fileSchema = checkFileSize(
  z.object({
    size: z.number().min(1, 'File cannot be empty'),
    type: z.string().min(1, 'File type is required'),
  })
)

export const imageSchema = checkFileSize(
  z.object({
    size: z.number().min(1, 'File cannot be empty'),
    type: z.string().min(1, 'File type is required'),
  })
).refine(
  (file) => {
    const fileType = getFileType(file.type)
    return fileType === 'image'
  },
  { message: 'Only JPEG, PNG, and GIF images are allowed' }
)
