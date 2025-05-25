import type { File } from '@/server/types'
import { executeQuery } from '@/server/utils/db'
import { queries } from '@/server/queries'

export const uploadFile = async (
  filename: string,
  original_name: string,
  mime_type: string,
  file_type: string,
  size: number,
  path: string,
  url: string,
  storage_adapter: 'local' | 's3' | 'cloudinary',
  metadata?: string,
  alt_text?: string
) => {
  const result = await executeQuery<File>(queries.files.saveFile, [
    filename,
    original_name,
    mime_type,
    file_type,
    size,
    path,
    url,
    storage_adapter,
    metadata,
    alt_text,
  ])
  return result.rows[0]
}

export const getFilesByIds = async (ids: string[]) => {
  const result = await executeQuery<File>(queries.files.getFilesByIds, [ids])
  return result.rows
}

export const deleteFiles = async (ids: string[]) =>
  await executeQuery(queries.files.deleteFiles, [ids])
