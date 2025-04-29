import { themeCookie } from '@/cookies.server'

export const getTheme = async (request: Request) => {
  const headers = request.headers.get('Cookie')
  return (await themeCookie.parse(headers)) as 'light' | 'dark'
}
