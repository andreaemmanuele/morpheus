import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { authCookie } from '@/cookies.server'
import { getAllRoles } from '@/lib/roles'

export const getRoles = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)
  return await getAllRoles(token)
}
