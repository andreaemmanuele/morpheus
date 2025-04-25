import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { authCookie } from '@/cookies.server'

export const login = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')

  const response = await fetch(`${process.env.BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const result = await response.json()
  if (!response.ok) return { error: result.error }

  return redirect('/', {
    headers: { 'Set-Cookie': await authCookie.serialize(result.accessToken) },
  })
}
