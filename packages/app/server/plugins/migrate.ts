import fp from 'fastify-plugin'
import { queries } from '../queries/index.js'
import chalk from 'chalk'
import ora from 'ora'

export default fp(async (fastify) => {
  fastify.decorate('runMigrations', async () => {
    const client = await fastify.pg.connect()
    try {
      const loader = ora('Running migrations').start()
      loader.color = 'blue'
      await client.query('BEGIN')
      await Promise.all(
        queries.migrations.map(
          async (migration: string) => await client.query(migration)
        )
      )
      await client.query(queries.permissions.checkPermissionFn)
      await client.query('COMMIT')
      loader.stop()
      console.log(chalk.blue('Database ready 🗿'))
    } catch (err) {
      await client.query('ROLLBACK')
      console.log({ err })
      throw err
    } finally {
      client.release()
    }
  })
})
