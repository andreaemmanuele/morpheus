import type { MetaFunction } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { Project } from '../../server/types'
import { Outlet, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
import { redirect } from '@remix-run/server-runtime'
import { authCookie, themeCookie } from '@/cookies.server'
import { softRouteGuardLoader } from '@/loaders/auth'
import { sessionStore } from '@/stores/session'
import { DashboardTemplate } from '@/components/templates/dashboard'
import { getSession } from '@/lib/session'
import { getAllProjects } from '@/lib/projects'

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Morpheus dashboard' },
]

export const loader = async (data: LoaderFunctionArgs) => {
  const { isLoggedIn, authCookie: _cookie } = await softRouteGuardLoader(data)
  if (!isLoggedIn) return redirect('/login')

  const headers = data.request.headers.get('Cookie')
  const theme = await themeCookie.parse(headers)
  const session = await getSession(_cookie)

  const newAccessTokenExists = session?.accessToken !== _cookie
  const token = newAccessTokenExists ? session?.accessToken : _cookie

  const projects = await getAllProjects(token)

  const response = {
    theme,
    session,
    projects,
  }

  if (newAccessTokenExists) {
    return Response.json(response, {
      headers: {
        'Set-Cookie': await authCookie.serialize(session?.accessToken),
      },
    })
  }

  return Response.json(response)
}

export default function DashboardPage() {
  const data = useLoaderData<typeof loader>()
  const { setSession } = sessionStore()

  useEffect(() => {
    if (!data.session) return
    setSession(data.session)
  }, [data.session])

  const projects =
    data.projects?.map(({ name, icon, slug }: Project) => ({
      name,
      logo: icon,
      url: `/${slug}`,
    })) ?? []

  return (
    <DashboardTemplate projects={projects} theme={data.theme}>
      <Outlet />
    </DashboardTemplate>
  )
}
