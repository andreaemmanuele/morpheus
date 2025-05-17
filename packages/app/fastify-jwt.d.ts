import type { UserSessionData } from '@/server/types'
import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserSessionData
  }
}
