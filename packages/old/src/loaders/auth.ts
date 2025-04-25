import { LoaderFunctionArgs, redirect } from 'react-router'
import { authCookie } from '@/cookies.server.ts'

export const authRouteGuard = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await authCookie.parse(headers)
  if (!cookie) return redirect('/login')
}

export const guestRouteGuard = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await authCookie.parse(headers)
  if (cookie) return redirect('/')
}
