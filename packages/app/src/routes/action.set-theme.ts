import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { themeCookie } from '@/cookies.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const theme = formData.get('theme')
  return Response.json(theme, {
    headers: {
      'Set-Cookie': await themeCookie.serialize(theme),
    },
  })
}
