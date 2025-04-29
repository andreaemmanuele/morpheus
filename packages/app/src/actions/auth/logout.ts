import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { deleteSession, logout } from '@/lib/session'

export const logoutAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const refreshToken = formData.get('refreshToken') as string
  await logout(refreshToken)

  return redirect('/login', {
    headers: {
      'Set-Cookie': await deleteSession(),
    },
  })
}
