import type { FastifyInstance } from 'fastify'
import React from 'react'
import {
  findUserByEmail,
  findUserById,
  updateUserStatus,
  updateSuspendedToken,
  updateLastLogin,
  incrementLoginAttempts,
  validatePassword,
  findUserBySuspendedToken,
  resetLoginAttempts,
} from '../services/user.js'

import {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
} from '../services/refresh-token.js'
import { sendEmail } from '../emails/index.js'
import { AccountLocked } from '../emails/templates/AccountLocked.js'
import { authenticate } from '../utils/auth.js'
import { generateRandomToken } from '../utils/tokens.js'
import {
  loginBodySchema,
  refreshTokenSchema,
  unlockAccountSchema,
} from '../schemas/auth.js'

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
      const { email, password } = loginBodySchema.parse(
        JSON.parse(request.body as string)
      )

      const user = await findUserByEmail(email)
      if (!user) {
        reply.code(401).send({ error: 'Invalid credentials' })
        return
      }

      const isPasswordValid = await validatePassword(
        password,
        user.password_hash
      )

      if (!isPasswordValid) {
        const query = await incrementLoginAttempts(user.id)
        if (query && query.login_attempts >= 5 && user.status === 'active') {
          const token = generateRandomToken()
          try {
            await Promise.all([
              updateUserStatus('suspended', user.id),
              updateSuspendedToken(token, user.id),
              sendEmail(
                React.createElement(AccountLocked, {
                  token,
                }),
                {
                  subject: 'Your account has been suspended',
                  to: email,
                }
              ),
            ])
          } catch (error) {
            console.log({ error })
          }
          reply.code(403).send({
            error:
              'You have reached maximum login attempts. An email has been sent to unlock your account.',
          })
          return
        }
        reply.code(401).send({ error: 'Invalid credentials' })
        return
      }

      if (!!user && user.status === 'suspended') {
        reply.code(403).send({
          error: 'Account suspended. An email has been sent to unlock it.',
        })
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

  fastify.get(
    '/auth/unlock-account/:token',
    {
      config: {
        rateLimit: {
          max: 3,
          timeWindow: '15 minutes',
        },
      },
    },
    async (request, reply) => {
      const { token } = unlockAccountSchema.parse(request.params)
      const user = await findUserBySuspendedToken(token)
      if (!user) {
        reply.code(401).send({ error: 'Invalid token' })
        return
      }
      await Promise.all([
        updateSuspendedToken(null, user.id),
        updateUserStatus('active', user.id),
        resetLoginAttempts(user.id),
      ])
      reply.redirect(process.env.BASE_URL || '/')
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
