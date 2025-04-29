import type { MetaFunction } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { Project } from '../../server/types'
import { Outlet, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
import { redirect } from '@remix-run/server-runtime'
import { sessionLoader, softRouteGuardLoader } from '@/loaders/auth'
import { sessionStore } from '@/stores/session'
import { DashboardTemplate } from '@/components/templates/dashboard'
import { getTheme } from '@/lib/theme'
import { getAllProjects } from '@/lib/projects'

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Morpheus dashboard' },
]

export const loader = async (data: LoaderFunctionArgs) => {
  const { isLoggedIn } = await softRouteGuardLoader(data)
  if (!isLoggedIn) return redirect('/login')

  return await sessionLoader(data, async ({ session, token, headers }) => {
    const theme = await getTheme(data.request)
    const projects = await getAllProjects(token)
    return Response.json(
      {
        theme,
        session,
        projects,
      },
      { ...(headers ? { headers } : {}) }
    )
  })
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
