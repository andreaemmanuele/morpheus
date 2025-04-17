import type { AddressInfo } from 'node:net'

import Fastify from 'fastify'
import { configDotenv } from 'dotenv'
import migrate from '@/src/plugins/migrate'
import jwt from '@/src/plugins/jwt'
import authRoutes from '@/src/routes/auth'
import { authenticate } from '@/src/utils/auth'

configDotenv()

const fastify = Fastify({
  logger: true,
})

// PLUGINS
fastify.register(migrate)
fastify.register(jwt)

// ROUTES
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
