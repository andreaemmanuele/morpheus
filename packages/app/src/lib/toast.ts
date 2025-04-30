import { redirect } from '@remix-run/server-runtime'
import { toastCookie } from '@/cookies.server'

export const redirectWithToast = async (path: string, message: string) =>
  redirect(path, {
    headers: {
      'Set-Cookie': await toastCookie.serialize(message),
    },
  })
