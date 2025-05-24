import fp from 'fastify-plugin'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { getConfig } from '@/server/utils/config'
import { setupUploadDirectories, UPLOAD_DIR } from '@/server/utils/file-system'

export default fp(async (fastify) => {
  const config = await getConfig()
  if (!config?.storage) throw new Error('Failed to read storage config')
  await fastify.register(fastifyMultipart, {
    limits: {
      fileSize: config?.storage?.fileSize || 50 * 1024 * 1024, // 50MB default
      files: 10,
    },
  })

  await fastify.register(fastifyStatic, {
    root: UPLOAD_DIR,
    prefix: '/uploads/',
  })

  setupUploadDirectories()
})
