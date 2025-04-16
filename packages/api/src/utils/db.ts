import postgres from '@fastify/postgres'
import fastify from 'fastify'

export const connect = async () => {
  const fs = fastify()
  await fs.register(postgres, {
    connectionString: process.env.POSTGRES_DB_URL as string,
  })

  const client = await fs.pg.connect()
  return { client }
}
