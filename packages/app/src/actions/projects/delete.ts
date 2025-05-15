import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { authCookie, projectCookie, sidebarCookie } from '@/cookies.server'
import { deleteProject, getAllProjects } from '@/lib/projects'
import { redirectWithToast } from '@/lib/toast'
import { deleteCookie } from '@/lib/cookie'

export const deleteProjectAction = async ({ request }: ActionFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  const formData = await request.formData()
  const projectSlug = formData.get('slug') as string
  try {
    await deleteProject(token, projectSlug)
    const projects = await getAllProjects(token)
    if (!projects || !projects.length) {
      return redirectWithToast('/', 'Project deleted successfully.', [
        ['Set-Cookie', await deleteCookie(projectCookie)],
        ['Set-Cookie', await sidebarCookie.serialize(false)],
      ])
    }

    return redirectWithToast(
      `/${projects[0]?.slug}`,
      'Project deleted successfully.'
    )
  } catch {
    return redirectWithToast(
      `/${projectSlug}/settings`,
      'Cannot delete project'
    )
  }
}
