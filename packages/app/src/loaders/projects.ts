import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { projectCookie } from '@/cookies.server'

export const loadDefaultProject = async (data: LoaderFunctionArgs) => {
  const headers = data.request.headers.get('Cookie')
  const project = await projectCookie.parse(headers)
  if (!project) return null
  return redirect(`/${project}`)
}
