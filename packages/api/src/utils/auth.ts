import type { FastifyReply, FastifyRequest } from 'fastify'
import { findUserByEmail } from '@/src/services/user'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify()
  } catch {
    reply.code(401).send({ error: 'Unauthorized' })
  }
}

export const isAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await authenticate(request, reply)
    const user = await findUserByEmail(request.user.email)
    if (user.role_id !== 1) reply.code(403).send({ error: 'Forbidden' })
  } catch {
    reply.code(403).send({ error: 'Forbidden' })
  }
}
