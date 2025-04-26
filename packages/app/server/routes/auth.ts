import type { FastifyInstance } from 'fastify'
import React from 'react'
import bcryptjs from 'bcryptjs'
import { changePasswordSchema } from '@morpheus/shared/schemas'
import {
  findUserByEmail,
  findUserById,
  findUserByResetToken,
  findUserBySuspendedToken,
  updatePassword,
  updateUserStatus,
  updateSuspendedToken,
  updateLastLogin,
  updateResetTokenAndExpiration,
  incrementLoginAttempts,
  resetLoginAttempts,
  validatePassword,
} from '../services/user.js'

import {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
} from '../services/refresh-token.js'

import { sendEmail } from '../emails/index.js'
import { AccountLocked } from '../emails/templates/AccountLocked.js'
import { RecoverPassword } from '../emails/templates/RecoverPassword.js'
import { authenticate } from '../utils/auth.js'
import { generateRandomToken } from '../utils/tokens.js'
import {
  loginBodySchema,
  recoveryPasswordSchema,
  refreshTokenSchema,
  resetPasswordSchema,
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
    '/auth/recovery-password',
    {
      config: {
        rateLimit: {
          max: 3,
          timeWindow: '15 minutes',
        },
      },
    },
    async (request, reply) => {
      const { email } = recoveryPasswordSchema.parse(
        JSON.parse(request.body as string)
      )

      const user = await findUserByEmail(email)
      const sendResponse = () => {
        reply.code(200).send({
          message:
            'If your account exists, you will get a recovery link for resetting your password',
        })
      }

      if (!user) {
        sendResponse()
        return
      }

      const token = generateRandomToken()
      try {
        await Promise.all([
          updateResetTokenAndExpiration(token, user.id),
          sendEmail(
            React.createElement(RecoverPassword, {
              token,
            }),
            {
              subject: 'Your recovery password link',
              to: email,
            }
          ),
        ])
      } catch (error) {
        console.error(error)
      }

      sendResponse()
    }
  )

  fastify.post(
    '/auth/reset-password',
    {
      config: {
        rateLimit: {
          max: 3,
          timeWindow: '15 minutes',
        },
      },
    },
    async (request, reply) => {
      const { token, newPassword, confirmPassword } = resetPasswordSchema.parse(
        JSON.parse(request.body as string)
      )

      const { error: validationError } = changePasswordSchema.safeParse({
        password: newPassword,
        confirmPassword,
      })

      if (validationError) {
        reply.code(400).send({ error: validationError.errors[0]?.message })
      }

      const user = await findUserByResetToken(token)
      if (!user) {
        reply.code(401).send({ error: 'Token expired' })
        return
      }

      try {
        const passwordHash = await bcryptjs.hash(newPassword, 10)
        await Promise.all([
          updatePassword(passwordHash, user.id),
          updateResetTokenAndExpiration(null, user.id),
        ])
      } catch (e) {
        console.error(e)
        reply
          .code(500)
          .send({ error: 'Something went wrong. Please try again.' })
        return
      }

      reply.code(200).send({ message: 'Password reset successfully' })
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

      const url = new URL(`${process.env.BASE_URL}/login`)

      if (!user) {
        url.searchParams.set('message', 'token-invalid')
        reply.redirect(url.toString())
        return
      }

      await Promise.all([
        updateSuspendedToken(null, user.id),
        updateUserStatus('active', user.id),
        resetLoginAttempts(user.id),
      ])

      url.searchParams.set('message', 'account-unlocked')
      reply.redirect(url.toString())
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
