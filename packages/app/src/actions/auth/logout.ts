import { redirect } from '@remix-run/server-runtime'
import { deleteSession } from '@/lib/session'

export const logoutAction = async () => {
  await fetch(`${process.env.BASE_URL}/api/auth/logout`, {
    method: 'POST',
  })

  return redirect('/login', {
    headers: {
      'Set-Cookie': await deleteSession(),
    },
  })
}
