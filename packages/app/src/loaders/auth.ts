import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { authCookie } from '@/cookies.server'

export const authRouteGuard = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await authCookie.parse(headers)
  if (!cookie) return redirect('/login')
  return null
}

export const guestRouteGuard = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await authCookie.parse(headers)
  if (cookie) return redirect('/')
  return null
}

export const softRouteGuard = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await authCookie.parse(headers)
  return !!cookie
}
