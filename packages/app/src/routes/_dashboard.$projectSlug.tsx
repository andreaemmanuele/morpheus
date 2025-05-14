import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { Project } from '../../server/types'
import { Outlet, useLoaderData } from '@remix-run/react'
import { getProject } from '@/lib/projects'
import { authCookie } from '@/cookies.server'
import { projectStore } from '@/stores/project'
import { useEffect } from 'react'
import { breadcrumbStore } from '@/stores/breadcrumb'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { projectSlug } = params as { projectSlug: string }
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)
  return await getProject(token, projectSlug)
}

export default function ProjectPage() {
  const data = useLoaderData<Project>()
  const { setProject } = projectStore()
  const { setBreadcrumb } = breadcrumbStore()

  useEffect(() => {
    if (!data) return
    setProject({
      id: data.id,
      icon: data.icon,
      name: data.name,
      slug: data.slug,
    })
    setBreadcrumb([{ id: 1, name: data.name }])
  }, [data])

  return <Outlet />
}
