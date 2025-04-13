declare module 'fastify' {
  interface FastifyInstance {
    runMigrations: () => Promise<void>
  }
}

export default {}
