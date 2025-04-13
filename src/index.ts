import type { AddressInfo } from 'node:net'
import Fastify from 'fastify'
import authRoutes from '#routes/auth.ts'

const fastify = Fastify({
  logger: true,
})

fastify.register(import('@fastify/postgres'), {
  connectionString: 'postgres://postgres@localhost/postgres',
})

fastify.register(authRoutes)

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    const server = fastify.server.address() as AddressInfo
    console.log(`Server is running on http://localhost:${server.port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
