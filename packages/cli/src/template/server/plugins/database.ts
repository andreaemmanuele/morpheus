import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres'

let app: FastifyInstance | null = null

export default fp(async (fastify) => {
  await fastify.register(fastifyPostgres, {
    connectionString: process.env.POSTGRES_DB_URL as string,
    max: Number(process.env.POSTGRES_MAX_CONNECTION),
    idleTimeoutMillis: Number(process.env.POSTGRES_DB_TIMEOUT),
    connectionTimeoutMillis: Number(process.env.POSTGRES_CONNECTION_TIMEOUT),
  })

  app = fastify
})

export { app }
