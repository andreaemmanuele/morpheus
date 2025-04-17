declare module '@/src/plugins/*' {
  import { FastifyPluginCallback } from 'fastify'
  const plugin: FastifyPluginCallback
  export default plugin
}

declare module '@/src/routes/auth' {
  import { FastifyPluginCallback } from 'fastify'
  const routes: FastifyPluginCallback
  export default routes
}

declare module '@/src/utils/db' {
  import { PoolClient } from 'pg'
  export const connect: () => Promise<{ client: PoolClient }>
}

declare module '@/src/*' {
  export {
    findUserByEmail,
    findUserById,
    generatePasswordHash,
    validatePassword,
    updateLastLogin,
    incrementLoginAttempts,
  } from './src/services/user'

  export {
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
  } from './src/services/refresh-token'

  export * from './src/plugins/migrate'
  export { queries } from './src/queries'
  export { loginBodySchema, refreshTokenSchema } from './src/schemas/auth'
  export { authenticate } from './src/utils/auth'
}
