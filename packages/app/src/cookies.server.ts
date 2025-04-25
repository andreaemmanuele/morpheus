import { createCookie } from '@remix-run/node'

export const authCookie = createCookie('auth', {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30, // 1 month
  secure: process.env.IS_PRODUCTION === 'true',
})
