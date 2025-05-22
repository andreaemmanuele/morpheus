import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { deleteSession } from '@/lib/session'
import { deleteCookie } from '@/lib/cookie'
import { authCookie, projectCookie } from '@/cookies.server'

export const logoutAction = async ({ request }: ActionFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  await fetch(`${process.env.BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })

  return redirect('/login', {
    headers: [
      ['Set-Cookie', await deleteSession()],
      ['Set-Cookie', await deleteCookie(projectCookie)],
    ],
  })
}
