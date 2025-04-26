import type { ActionFunctionArgs } from '@remix-run/server-runtime'

export const resetPassword = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const newPassword = formData.get('password')
  const confirmPassword = formData.get('confirm-password')

  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  const response = await fetch(
    `${process.env.BASE_URL}/api/auth/reset-password`,
    {
      method: 'POST',
      body: JSON.stringify({
        token,
        newPassword,
        confirmPassword,
      }),
    }
  )

  const result = await response.json()
  if (!response.ok) return { error: result.error, message: null }

  return { error: null, message: result.message }
}
