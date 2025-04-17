import type { FastifyInstance } from 'fastify'
import {
  findUserByEmail,
  findUserById,
  incrementLoginAttempts,
  updateLastLogin,
  validatePassword,
} from '@/src/services/user'

import {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
} from '@/src/services/refresh-token'
import { authenticate } from '@/src/utils/auth'
import { loginBodySchema, refreshTokenSchema } from '@/src/schemas/auth'

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/login', async (request, reply) => {
    const { email, password } = loginBodySchema.parse(request.body)

    const user = await findUserByEmail(email)
    if (!user) {
      reply.code(401).send({ error: 'Invalid credentials' })
      return
    }

    const isPasswordValid = await validatePassword(password, user.password_hash)
    if (!isPasswordValid) {
      await incrementLoginAttempts(user.id)
      reply.code(401).send({ error: 'Invalid credentials' })
      return
    }

    const accessToken = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role_id,
    })

    const refreshToken = await createRefreshToken(accessToken)
    await updateLastLogin(user.id)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    }
  })

  fastify.post('/auth/refresh', async (request, reply) => {
    const { refreshToken } = refreshTokenSchema.parse(request.body)

    if (!refreshToken) {
      reply.code(400).send({ error: 'Refresh token is required' })
      return
    }

    const tokenData = await findRefreshToken(refreshToken)
    if (!tokenData) {
      reply.code(401).send({ error: 'Invalid refresh token' })
      return
    }

    const user = await findUserById(tokenData.user_id)
    if (!user) {
      reply.code(401).send({ error: 'User not found' })
      return
    }

    const accessToken = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role_id,
    })

    return { accessToken }
  })

  fastify.post(
    '/auth/logout',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { refreshToken } = refreshTokenSchema.parse(request.body)

      if (!refreshToken) {
        reply.code(400).send({ error: 'Refresh token is required' })
        return
      }

      await revokeRefreshToken(refreshToken)
      return { message: 'Logged out successfully' }
    }
  )
}
