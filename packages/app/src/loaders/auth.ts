import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { Session } from '@/server/types'
import { redirect } from '@remix-run/server-runtime'
import { authCookie } from '@/cookies.server'
import { deleteSession, getSession } from '@/lib/session'

type SendResponse = {
  headers?: HeadersInit
  session: Session | null | undefined
  token: string
}

export const authRouteGuardLoader = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await authCookie.parse(headers)
  if (!cookie) return redirect('/login')
  return null
}

export const guestRouteGuardLoader = async ({
  request,
}: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await authCookie.parse(headers)
  if (cookie) return redirect('/')
  return null
}

export const softRouteGuardLoader = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await authCookie.parse(headers)
  return { isLoggedIn: !!cookie }
}

export const sessionLoader = async (
  { request }: LoaderFunctionArgs,
  sendResponse: ({ session, token, headers }: SendResponse) => Promise<Response>
) => {
  const headers = request.headers.get('Cookie')
  const cookie = (await authCookie.parse(headers)) as string
  let session: Session | null | undefined
  let errorRetrievingSession = false

  try {
    session = await getSession(cookie)
  } catch (e) {
    console.error(e)
    errorRetrievingSession = true
  }

  if (session?.refreshTokenExpired || errorRetrievingSession) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await deleteSession(),
      },
    })
  }

  const newAccessTokenExists = session?.accessToken !== cookie
  const token = (newAccessTokenExists ? session?.accessToken : cookie) ?? ''

  if (newAccessTokenExists) {
    return await sendResponse({
      session,
      token,
      headers: {
        'Set-Cookie': await authCookie.serialize(token),
      },
    })
  }

  return await sendResponse({ session, token })
}
