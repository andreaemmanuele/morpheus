import { redirect } from '@remix-run/server-runtime'
import { toastCookie } from '@/cookies.server'

export const redirectWithToast = async (
  path: string,
  message: string,
  headers?: HeadersInit
) => {
  const responseHeaders = new Headers(headers)
  responseHeaders.append('Set-Cookie', await toastCookie.serialize(message))

  return redirect(path, {
    headers: responseHeaders,
  })
}
