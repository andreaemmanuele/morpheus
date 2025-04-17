import fp from 'fastify-plugin'
import { queries } from '@/src/queries'
import { connect } from '@/src/utils/db'

export default fp(async (fastify) => {
  fastify.decorate('runMigrations', async () => {
    const { client } = await connect()
    try {
      fastify.log.info('Initializing database tables...')
      await client.query('BEGIN')
      await Promise.all(
        queries.migrations.map(
          async (migration: string) => await client.query(migration)
        )
      )
      await client.query('COMMIT')
      fastify.log.info('Database initialized successfully')
    } catch (err) {
      await client.query('ROLLBACK')
      console.log({ err })
      throw err
    } finally {
      client.release()
    }
  })
})
