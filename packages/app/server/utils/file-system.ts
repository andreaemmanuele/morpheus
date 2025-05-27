import fs from 'fs'
import path from 'path'
import { cleanDoubleSlashes } from 'ufo'
import { getConfig } from '@/server/utils/config'

const config = await getConfig()

export const UPLOAD_DIR = path.join(
  process.cwd(),
  cleanDoubleSlashes(`/server/${config?.storage.publicPath}`)
)

export const setupUploadDirectories = () => {
  const directories = [
    UPLOAD_DIR,
    path.join(UPLOAD_DIR, 'images'),
    path.join(UPLOAD_DIR, 'videos'),
    path.join(UPLOAD_DIR, 'audio'),
    path.join(UPLOAD_DIR, 'documents'),
    path.join(UPLOAD_DIR, 'others'),
  ]

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`Created directory: ${dir}`)
    }
  })
}

export const getSubDirectory = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return 'images'
  } else if (mimeType.startsWith('video/')) {
    return 'videos'
  } else if (mimeType.startsWith('audio/')) {
    return 'audio'
  } else if (['pdf', 'document', 'text', 'spreadsheet'].includes(mimeType)) {
    return 'documents'
  } else {
    return 'others'
  }
}

export const getFileType = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('application/pdf')) return 'pdf'
  if (
    [
      'text/plain',
      'text/csv',
      'text/html',
      'text/css',
      'text/javascript',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
      'text/rtf',
      'application/vnd.oasis.opendocument.text',
    ].includes(mimeType)
  )
    return 'document'
  if (['spreadsheet', 'excel'].includes(mimeType)) return 'spreadsheet'
  if (
    [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-tar',
    ].includes(mimeType)
  )
    return 'archive'
  return 'other'
}
