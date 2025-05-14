import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { authCookie, projectCookie } from '@/cookies.server'

export const defaultProjectLoader = async (data: LoaderFunctionArgs) => {
  const headers = data.request.headers.get('Cookie')
  const project = await projectCookie.parse(headers)
  if (!project) return null
  return redirect(`/${project}`)
}

export const projectTeamLoader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)
  const { projectSlug } = params as { projectSlug: string }
  const response = await fetch(
    `${process.env.BASE_URL}/api/projects/${projectSlug}/team`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  if (!response.ok) return { members: [] }
  const result = await response.json()
  return { members: result }
}
