import { findUserByEmail } from '../services/user.js'
export const authenticate = async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch {
    reply.code(401).send({ error: 'Unauthorized' })
  }
}
export const isAdmin = async (request, reply) => {
  try {
    await authenticate(request, reply)
    const user = await findUserByEmail(request.user.email)
    if (user && user.role_id !== 1) {
      reply.code(403).send({ error: 'Forbidden' })
    }
  } catch {
    reply.code(403).send({ error: 'Forbidden' })
  }
}
