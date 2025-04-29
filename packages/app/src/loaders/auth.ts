import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { authCookie } from '@/cookies.server'

export const authRouteGuardLoader = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await authCookie.parse(headers)
  if (!cookie) return redirect('/login')
  return null
}

export const guestRouteGuardLoader = async ({
  request,
}: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await authCookie.parse(headers)
  if (cookie) return redirect('/')
  return null
}

export const softRouteGuardLoader = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await authCookie.parse(headers)
  return { isLoggedIn: !!cookie, authCookie: cookie }
}
