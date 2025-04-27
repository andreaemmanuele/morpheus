import type { MetaFunction } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { Outlet, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
import { redirect } from '@remix-run/server-runtime'
import { themeCookie } from '@/cookies.server'
import { softRouteGuard } from '@/loaders/auth'
import { sessionStore } from '@/stores/session'
import { DashboardTemplate } from '@/components/templates/dashboard'
import { getSession } from '@/lib/session'

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Morpheus dashboard' },
]

export const loader = async (data: LoaderFunctionArgs) => {
  const { isLoggedIn, authCookie } = await softRouteGuard(data)
  if (!isLoggedIn) return redirect('/login')

  const headers = data.request.headers.get('Cookie')
  const theme = await themeCookie.parse(headers)
  const session = await getSession(authCookie)

  return { theme, session }
}

export default function DashboardPage() {
  const data = useLoaderData<typeof loader>()
  const { setSession } = sessionStore()

  useEffect(() => {
    setSession(data.session)
  }, [data.session])

  return (
    <DashboardTemplate theme={data.theme}>
      <Outlet />
    </DashboardTemplate>
  )
}
