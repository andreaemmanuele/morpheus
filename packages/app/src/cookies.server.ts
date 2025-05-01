import { createCookie } from '@remix-run/node'

export const themeCookie = createCookie('theme', {
  path: '/',
})

export const toastCookie = createCookie('toast', {
  path: '/',
})

export const authCookie = createCookie('auth', {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30, // 1 month
  secrets: [process.env.COOKIE_SECRET_KEY as string],
  secure: process.env.IS_PRODUCTION === 'true',
})

export const projectCookie = createCookie('project', {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
})
