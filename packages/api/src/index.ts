import type { AddressInfo } from 'node:net'

import Fastify from 'fastify'
import 'dotenv/config'
import migrate from '@/src/migrations/init.js'

const fastify = Fastify({
  logger: true,
})

fastify.register(migrate)

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
