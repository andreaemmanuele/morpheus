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

  if (response?.ok) return await response?.json()
  return null
}

export const deleteSession = async () =>
  await authCookie.serialize(null, {
    maxAge: 0,
    expires: new Date(0),
  })
