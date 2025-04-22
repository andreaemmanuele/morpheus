import fp from 'fastify-plugin'
import fastifyStatic from '@fastify/static'
import path, { dirname } from 'path'
import { FastifyReply, FastifyRequest } from 'fastify'
import { fileURLToPath } from 'url'

export default fp((fastify) => {
  if (!process.env.IS_PRODUCTION) return

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
  })

  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    if (request.url.startsWith('/api') || request.url.startsWith('/auth')) {
      return reply.code(404).send({ error: 'Not found' })
    }

    return reply.sendFile('index.html')
  })
})
