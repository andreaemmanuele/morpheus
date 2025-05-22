import type { FastifyInstance } from 'fastify'
import { getAllRoles } from '@/server/services/roles'
import { authenticate } from '@/server/utils/auth'

export default async function rolesRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/roles',
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const roles = await getAllRoles()
        reply.code(200).send(roles)
      } catch (error) {
        console.error(error)
        reply.code(500).send('Internal Server Error')
      }
    }
  )
}
