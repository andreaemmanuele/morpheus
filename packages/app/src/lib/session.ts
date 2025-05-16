import type { Session } from '@/server/types'
import { authCookie } from '@/cookies.server'

export const getSession = async (token: string) => {
  let response
  try {
    response = await fetch(`${process.env.BASE_URL}/api/auth/session`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error(error)
  }

  const result = (await response?.json()) as Session | null
  if (response?.ok) return result
}

export const deleteSession = async () =>
  await authCookie.serialize(null, {
    maxAge: 0,
    expires: new Date(0),
  })
