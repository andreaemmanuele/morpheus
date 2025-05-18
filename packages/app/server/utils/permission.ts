import type { FastifyReply, FastifyRequest } from 'fastify'
import type { Permissions } from '@/server/types'
import { checkPermission } from '@/server/services/permissions'

export const hasPermission = async (
  request: FastifyRequest,
  reply: FastifyReply,
  code: Permissions,
  projectId: number
) => {
  const hasPermission = await checkPermission(request.user.id, projectId, code)
  if (!hasPermission) {
    reply.code(403).send({ error: 'Forbidden' })
    return
  }
}
