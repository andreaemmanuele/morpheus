import type { AddressInfo } from 'node:net'

import Fastify from 'fastify'
import { configDotenv } from 'dotenv'
import migrate from '@/src/plugins/migrate'
import cors from '@/src/plugins/cors'
import rateLimit from '@/src/plugins/rate-limit'
import jwt from '@/src/plugins/jwt'
import proxy from '@/src/plugins/proxy'
import serveStatic from '@/src/plugins/serve-static'
import authRoutes from '@/src/routes/auth'
import { authenticate, isAdmin } from '@/src/utils/auth'

configDotenv()

const fastify = Fastify({
  logger: true,
})

fastify.register(migrate)
fastify.register(cors)
fastify.register(rateLimit)
fastify.register(jwt)

fastify.register(authRoutes, { prefix: '/api' })

fastify.get(
  '/api/protected',
  {
    onRequest: [authenticate],
  },
  async (request) => {
    return { message: 'This is a protected route', user: request.user }
  }
)

fastify.get(
  '/api/admin/protected',
  {
    onRequest: [isAdmin],
  },
  async (request) => {
    return { message: 'This is a admin protected route', user: request.user }
  }
)

fastify.register(proxy)
fastify.register(serveStatic)

fastify.ready(async () => {
  try {
    await fastify.runMigrations()
  } catch (err) {
    fastify.log.error('Failed to initialize database tables:', err)
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    const server = fastify.server.address() as AddressInfo
    console.log(`Server is listening at http://localhost:${server.port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
