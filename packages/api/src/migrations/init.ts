import fp from 'fastify-plugin'
import postgres from '@fastify/postgres'
import { queries } from '@/src/queries/index.js'

export default fp(async (fastify) => {
  await fastify.register(postgres, {
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
  })

  fastify.decorate('runMigrations', async () => {
    fastify.log.info('Initializing database tables...')
    const client = await fastify.pg.connect()
    try {
      await client.query('BEGIN')
      await client.query(queries.auth.createUsersTable)
      await client.query('COMMIT')
      fastify.log.info('Database initialized successfully')
    } catch (err) {
      await client.query('ROLLBACK')
      fastify.log.error('Database initialization failed:', err)
      throw err
    } finally {
      client.release()
    }
  })
})
