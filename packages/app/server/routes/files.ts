import type { FastifyInstance } from 'fastify'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import { v4 as uuid } from 'uuid'
import {
  getFileType,
  getSubDirectory,
  UPLOAD_DIR,
} from '@/server/utils/file-system'
import { uploadFile } from '@/server/services/files'
import { authenticate } from '@/server/utils/auth'

export default async function filesRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/files/upload',
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const parts = request.parts()
        const formData: Record<string, unknown> = {}
        const uploadedFiles = []

        for await (const part of parts) {
          if (part.type === 'field') {
            formData[part.fieldname] = part.value
          } else if (part.type === 'file') {
            const fileExtension = path.extname(part.filename)
            const uniqueFileName = `${uuid()}${fileExtension}`
            const subDir = getSubDirectory(part.mimetype)
            const fileType = getFileType(part.mimetype)
            const filePath = path.join(UPLOAD_DIR, subDir, uniqueFileName)
            const relativePath = path.relative(subDir, filePath)

            const metadata = {
              uploadedAt: new Date().toISOString(),
              fileExtension: fileExtension,
              subdirectory: subDir,
              originalPath: part.filename,
            }

            const writeStream = fs.createWriteStream(filePath)
            await pipeline(part.file, writeStream)

            let uploadedFile
            try {
              uploadedFile = await uploadFile(
                uniqueFileName,
                part.filename,
                part.mimetype,
                fileType,
                (await fs.promises.stat(filePath)).size,
                relativePath,
                'local',
                JSON.stringify(metadata),
                (formData['alt_text'] as string) || ''
              )
            } catch (error) {
              const _error = error as Error
              throw new Error(`dbError: ${_error.message}`)
            }

            uploadedFiles.push({
              ...uploadedFile,
              url: `/uploads/${relativePath}`,
            })

            reply.code(200).send(uploadedFiles)
          }
        }
      } catch (error) {
        console.error(error)
        reply.status(500).send({ message: 'File uploaded failed', error })
      }
    }
  )
}
