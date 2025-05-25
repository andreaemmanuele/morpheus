import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { authCookie, projectCookie, sidebarCookie } from '@/cookies.server'
import {
  getAllProjects,
  getProjectPictures,
  getProjectTeamMembers,
} from '@/lib/projects'

export const defaultProjectLoader = async (data: LoaderFunctionArgs) => {
  const headers = data.request.headers.get('Cookie')
  const token = await authCookie.parse(headers)
  const project = await projectCookie.parse(headers)
  if (!project) {
    const projects = await getAllProjects(token)
    if (!projects?.length) return null
    const firstProjectSlug = projects?.[0]?.slug
    if (projects?.length)
      return redirect(`/${firstProjectSlug}`, {
        headers: [
          ['Set-Cookie', await projectCookie.serialize(firstProjectSlug)],
          ['Set-Cookie', await sidebarCookie.serialize(true)],
        ],
      })
  }
  return redirect(`/${project}`)
}

export const projectTeamLoader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)
  const { projectSlug } = params as { projectSlug: string }
  return getProjectTeamMembers(token, projectSlug)
}

export const projectPicturesLoader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)
  const { projectSlug } = params as { projectSlug: string }
  return getProjectPictures(token, projectSlug)
}
