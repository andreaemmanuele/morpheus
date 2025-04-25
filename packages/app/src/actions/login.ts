import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { authCookie } from '@/cookies.server'

export const login = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const response = await fetch(`${process.env.BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const result = await response.json()
  if (!response.ok) {
    console.log({ result })
    return { error: result.error }
  }

  return redirect('/', {
    headers: { 'Set-Cookie': await authCookie.serialize(result.accessToken) },
  })
}
