import { redirect } from '@remix-run/server-runtime'
import { deleteSession } from '@/lib/session'
import { deleteCookie } from '@/lib/cookie'
import { projectCookie } from '@/cookies.server'

export const logoutAction = async () => {
  await fetch(`${process.env.BASE_URL}/api/auth/logout`, {
    method: 'POST',
  })

  return redirect('/login', {
    headers: [
      ['Set-Cookie', await deleteSession()],
      ['Set-Cookie', await deleteCookie(projectCookie)],
    ],
  })
}
