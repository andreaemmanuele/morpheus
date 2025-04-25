import type { ActionFunctionArgs } from '@remix-run/server-runtime'

export const recoverPassword = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const email = formData.get('email')

  const response = await fetch(
    `${process.env.BASE_URL}/api/auth/recovery-password`,
    {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    }
  )

  const result = await response.json()
  if (!response.ok) return { error: result.error }

  return { message: result.message }
}
