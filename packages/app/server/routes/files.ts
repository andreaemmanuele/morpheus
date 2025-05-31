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
import { deleteFiles, getFilesByIds, uploadFile } from '@/server/services/files'
import { authenticate } from '@/server/utils/auth'
import { fileSchema, getFilesIdsSchema } from '@/server/schemas/files'

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

            const chunks: Buffer[] = []
            for await (const chunk of part.file) {
              chunks.push(chunk)
            }
            const buffer = Buffer.concat(chunks)
            const fileSize = buffer.length
            fileSchema.parse({ type: fileType, size: fileSize })

            const metadata = {
              uploadedAt: new Date().toISOString(),
              fileExtension: fileExtension,
              subdirectory: subDir,
              originalPath: part.filename,
            }

            await fs.promises.writeFile(filePath, buffer)

            let uploadedFile
            const url = `/uploads/${relativePath}`
            try {
              uploadedFile = await uploadFile(
                uniqueFileName,
                part.filename,
                part.mimetype,
                fileType,
                fileSize,
                relativePath,
                url,
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
            })
          }
        }
        reply.code(200).send(uploadedFiles)
      } catch (error) {
        console.error(error)
        reply.status(500).send({ message: 'File uploaded failed', error })
      }
    }
  )

  fastify.delete(
    '/files',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { fileIds } = getFilesIdsSchema.parse(
        JSON.parse(request.body as string)
      )

      try {
        const files = await getFilesByIds(fileIds)
        for (const file of files) {
          const filePath = path.join(process.cwd(), file.url)
          if (!fs.existsSync(filePath)) {
            throw new Error(`file ${filePath} does not exist`)
          }
          fs.rmSync(filePath)
        }
        await deleteFiles(fileIds)
        reply.status(200).send({ message: 'File deleted successfully' })
      } catch (error) {
        console.error(error)
        reply.status(500).send({ message: 'Internal Server Error' })
      }
    }
  )
}
