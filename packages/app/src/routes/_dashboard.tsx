import type { MetaFunction } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { Project } from '../../server/types'
import { useEffect } from 'react'
import { Outlet, useLoaderData } from '@remix-run/react'
import { redirect } from '@remix-run/server-runtime'
import { sessionLoader, softRouteGuardLoader } from '@/loaders/auth'
import { themeLoader } from '@/loaders/theme'
import { sidebarLoader } from '@/loaders/sidebar'
import { sessionStore } from '@/stores/session'
import { DashboardTemplate } from '@/components/templates/dashboard'
import { getAllProjects } from '@/lib/projects'

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Morpheus dashboard' },
]

export const loader = async (data: LoaderFunctionArgs) => {
  const { isLoggedIn } = await softRouteGuardLoader(data)
  if (!isLoggedIn) return redirect('/login')

  return await sessionLoader(data, async ({ session, token, headers }) => {
    const theme = await themeLoader(data)
    const sidebarState = await sidebarLoader(data)
    const projects = await getAllProjects(token)
    return Response.json(
      {
        theme,
        session,
        projects,
        sidebarOpen: sidebarState,
        isFirstProject: !projects?.length,
      },
      { ...(headers ? { headers } : {}) }
    )
  })
}

export default function DashboardPage() {
  const data = useLoaderData<typeof loader>()
  const { setSession } = sessionStore()

  const projects =
    data.projects?.map(({ name, icon, slug }: Project) => ({
      name,
      slug,
      logo: icon,
      url: `/${slug}`,
    })) ?? []

  useEffect(() => {
    if (!data.session) return
    setSession(data.session)
  }, [data.session])

  return (
    <DashboardTemplate
      projects={projects}
      theme={data.theme}
      sidebarOpen={data.sidebarOpen}
      disableSidebar={data.isFirstProject}
    >
      <Outlet />
    </DashboardTemplate>
  )
}
