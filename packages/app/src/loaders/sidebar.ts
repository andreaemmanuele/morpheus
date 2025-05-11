import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { sidebarCookie } from '@/cookies.server'

export const sidebarLoader = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  return await sidebarCookie.parse(headers)
}
