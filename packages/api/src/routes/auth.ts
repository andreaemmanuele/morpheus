import type { FastifyInstance } from 'fastify'
import {
  findUserByEmail,
  findUserById,
  incrementLoginAttempts,
  updateUserStatus,
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
import { sendEmail } from '@/src/emails'

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/auth/login',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '15 minutes',
        },
      },
    },
    async (request, reply) => {
      const { email, password } = loginBodySchema.parse(request.body)

      const user = await findUserByEmail(email)
      if (!!user && user.login_attempts === 5) {
        reply.code(403).send({
          error: 'Account suspended. An email has been sent to unlock it.',
        })
        return
      }

      if (!user) {
        reply.code(401).send({ error: 'Invalid credentials' })
        return
      }

      const isPasswordValid = await validatePassword(
        password,
        user.password_hash
      )

      if (!isPasswordValid) {
        const { login_attempts } = await incrementLoginAttempts(user.id)
        if (login_attempts >= 5) {
          await Promise.all([
            updateUserStatus('suspended', user.id),
            sendEmail(fastify, '', {
              subject: 'Your account has been suspended',
              to: email,
            }),
          ])
          reply.code(403).send({
            error:
              'You have reached maximum login attempts. An email has been sent to unlock your account.',
          })
          return
        }
        reply.code(401).send({ error: 'Invalid credentials' })
        return
      }

      const accessToken = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role_id,
      })

      const refreshToken = await createRefreshToken(user.id)
      await updateLastLogin(user.id)

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role_id,
        },
      }
    }
  )

  fastify.post(
    '/auth/refresh',
    {
      config: {
        rateLimit: {
          max: 3,
          timeWindow: '15 minutes',
        },
      },
    },
    async (request, reply) => {
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
    }
  )

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
