import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { toastCookie } from '@/cookies.server'

export const toastLoader = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const message = await toastCookie.parse(headers)
  return Response.json(message)
}
