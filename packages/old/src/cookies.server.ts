import { createCookie } from 'react-router'

export const authCookie = createCookie('auth', {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  maxAge: 604800, // 1 week
  secure: process.env.NODE_ENV === 'production',
})
