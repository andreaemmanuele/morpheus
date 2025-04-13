import type { AddressInfo } from 'node:net'

import 'dotenv/config'
import Fastify from 'fastify'
import authRoutes from '#routes/auth.ts'

const fastify = Fastify({
  logger: true,
})

fastify.register(import('@fastify/postgres'), {
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
})

fastify.register(authRoutes)

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
