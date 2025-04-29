import type { MetaFunction } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { Project } from '../../server/types'
import { Outlet, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
import { redirect } from '@remix-run/server-runtime'
import { themeCookie } from '@/cookies.server'
import { softRouteGuard } from '@/loaders/auth'
import { sessionStore } from '@/stores/session'
import { DashboardTemplate } from '@/components/templates/dashboard'
import { getSession } from '@/lib/session'
import { getAllProjects } from '@/lib/projects'

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Morpheus dashboard' },
]

export const loader = async (data: LoaderFunctionArgs) => {
  const { isLoggedIn, authCookie } = await softRouteGuard(data)
  if (!isLoggedIn) return redirect('/login')

  const headers = data.request.headers.get('Cookie')
  const theme = await themeCookie.parse(headers)
  const [session, projects] = await Promise.allSettled([
    getSession(authCookie),
    getAllProjects(authCookie),
  ])

  return {
    theme,
    session: session.status === 'fulfilled' ? session.value : null,
    projects: projects.status === 'fulfilled' ? projects.value : null,
  }
}

export default function DashboardPage() {
  const data = useLoaderData<typeof loader>()
  const { setSession } = sessionStore()

  useEffect(() => {
    setSession(data.session)
  }, [data.session])

  const projects = data.projects.map(({ name, icon, slug }: Project) => ({
    name,
    logo: icon,
    url: `/${slug}`,
  }))

  return (
    <DashboardTemplate projects={projects} theme={data.theme}>
      <Outlet />
    </DashboardTemplate>
  )
}
