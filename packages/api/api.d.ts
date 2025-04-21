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
  import { PoolClient, QueryResult } from 'pg'
  export const connect: () => Promise<{ client: PoolClient }>
  export const executeQuery: <T>(
    query: string,
    params: T[]
  ) => QueryResult<unknown>
}

declare module '@/src/types' {
  export { User, UserRole, UserStatus, LoginAttempts, Token } from './src/types'
}

declare module '@/src/*' {
  export {
    findUserByEmail,
    findUserById,
    updateUserStatus,
    updateLastLogin,
    incrementLoginAttempts,
    generatePasswordHash,
    validatePassword,
  } from './src/services/user'

  export {
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
  } from './src/services/refresh-token'

  export * from './src/plugins/migrate'
  export { queries } from './src/queries'
  export { loginBodySchema, refreshTokenSchema } from './src/schemas/auth'
  export { authenticate, isAdmin } from './src/utils/auth'
  export { sendEmail } from './src/emails'
}
