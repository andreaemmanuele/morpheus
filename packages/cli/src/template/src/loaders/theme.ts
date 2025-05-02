import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { themeCookie } from '@/cookies.server'

export const themeLoader = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  return (await themeCookie.parse(headers)) as 'light' | 'dark' | undefined
}
