import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { authCookie, projectCookie, sidebarCookie } from '@/cookies.server'
import { getAllProjects, leaveProject } from '@/lib/projects'
import { redirectWithToast } from '@/lib/toast'
import { deleteCookie } from '@/lib/cookie'

export const leaveProjectAction = async ({ request }: ActionFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  const formData = await request.formData()
  const projectSlug = formData.get('slug') as string

  const response = await leaveProject(token, projectSlug)
  if (!response) {
    return redirectWithToast(
      request.headers.get('referer') as string,
      'Cannot leave project'
    )
  }

  const projects = await getAllProjects(token)
  if (!projects?.length) {
    return redirectWithToast('/', 'Project left successfully', [
      ['Set-Cookie', await deleteCookie(projectCookie)],
      ['Set-Cookie', await sidebarCookie.serialize(false)],
    ])
  }

  const nextProjectSlug = projects?.[0]?.slug ?? ''
  return redirectWithToast(`/${nextProjectSlug}`, 'Project left successfully', {
    'Set-Cookie': await projectCookie.serialize(nextProjectSlug),
  })
}
