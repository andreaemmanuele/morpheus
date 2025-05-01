import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { Project } from '../../server/types'
import { useLoaderData } from '@remix-run/react'
import { getProject } from '@/lib/projects'
import { authCookie } from '@/cookies.server'
import { projectStore } from '@/stores/project'
import { useEffect } from 'react'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { projectSlug } = params as { projectSlug: string }
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)
  return await getProject(token, projectSlug)
}

export default function NewProjectPage() {
  const data = useLoaderData<Project>()
  const { project, setProject } = projectStore()

  useEffect(() => {
    if (!data) return
    setProject({ id: data.id, slug: data.slug })
  }, [data])

  return <div>{project?.slug}</div>
}
