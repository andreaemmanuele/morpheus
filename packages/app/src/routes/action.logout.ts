import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { deleteSession } from '@/lib/session'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()

  await fetch(`${process.env.BASE_URL}/api/auth/logout`, {
    method: 'POST',
    body: JSON.stringify({
      refreshToken: formData.get('refreshToken'),
    }),
  })

  return redirect('/login', {
    headers: {
      'Set-Cookie': await deleteSession(),
    },
  })
}
