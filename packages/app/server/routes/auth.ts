import type { FastifyInstance } from 'fastify'
import type { AccessToken, Session } from '../types'
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
  findRefreshTokenByUserId,
} from '../services/refresh-token.js'

import { sendEmail } from '../emails/index.js'
import { AccountLocked } from '../emails/templates/AccountLocked.js'
import { RecoverPassword } from '../emails/templates/RecoverPassword.js'
import { authenticate } from '../utils/auth.js'
import { generateRandomToken } from '../utils/tokens.js'
import {
  loginBodySchema,
  recoveryPasswordSchema,
  resetPasswordSchema,
  tokenRequiredSchema,
} from '../schemas/auth.js'
import { getAllProjects } from '../services/project'
import { getIfTokenIsExpired } from '@/lib/tokens'

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

      const existingRefreshToken = await findRefreshTokenByUserId(user.id)

      const [refreshToken, projects] = await Promise.all([
        !existingRefreshToken
          ? createRefreshToken(user.id)
          : existingRefreshToken,
        getAllProjects(user.id),
        updateLastLogin(user.id),
      ])

      const defaultProject = projects[0]?.slug ?? ''
      const accessToken = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username ?? '',
        defaultProject,
        refreshToken: refreshToken?.token ?? '',
      })

      const isRefreshTokenExpired = getIfTokenIsExpired(
        refreshToken?.expires_at ?? ''
      )

      return {
        accessToken,
        refreshToken: refreshToken?.token ?? '',
        refreshTokenExpired: isRefreshTokenExpired,
        user: {
          id: user.id,
          email: user.email,
          username: user.username ?? '',
          defaultProject,
        },
      } satisfies Session
    }
  )

  fastify.get('/auth/session', async (request, reply) => {
    const token = fastify.jwt.lookupToken(request)
    const data = fastify.jwt.decode<AccessToken>(token)

    if (!data) {
      reply.code(401).send({ error: 'Token invalid' })
      return
    }

    const refreshTokenData = await findRefreshToken(data.refreshToken)
    const isAccessTokenExpired = getIfTokenIsExpired(data.exp * 1000)
    const isRefreshTokenExpired = getIfTokenIsExpired(
      refreshTokenData?.expires_at ?? ''
    )

    if (!isAccessTokenExpired) {
      reply.code(200).send({
        accessToken: token,
        refreshToken: data.refreshToken,
        refreshTokenExpired: isRefreshTokenExpired,
        user: {
          id: data.id,
          email: data.email,
          username: data.username,
          defaultProject: '', //get from user
        },
      } satisfies Session)
      return
    }

    const user = refreshTokenData
      ? await findUserById(refreshTokenData.user_id)
      : null

    // silent access token refresh
    const accessToken = fastify.jwt.sign({
      id: user?.id ?? 0,
      email: user?.email ?? '',
      username: user?.username ?? '',
      defaultProject: '', // get from user
      refreshToken: data.refreshToken,
    })

    reply.code(200).send({
      accessToken,
      refreshToken: data.refreshToken,
      refreshTokenExpired: isRefreshTokenExpired,
      user: {
        id: user?.id ?? 0,
        email: user?.email ?? '',
        username: user?.username ?? '',
        defaultProject: '', //get from user
      },
    } satisfies Session)
  })

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
      const { token } = tokenRequiredSchema.parse(request.params)
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
    '/auth/logout',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const token = fastify.jwt.lookupToken(request)
      const data = fastify.jwt.decode<Session>(token)

      if (!data?.refreshToken) {
        reply.code(400).send({ error: 'Refresh token is required' })
        return
      }

      return { message: 'Logged out successfully' }
    }
  )
}
