import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    runMigrations: () => Promise<void>
  }
}
