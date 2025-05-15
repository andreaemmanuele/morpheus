import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import type { Icons } from '@/lib/icons'
import { authCookie, sidebarCookie, projectCookie } from '@/cookies.server'
import { redirectWithToast } from '@/lib/toast'
import { createProject } from '@/lib/projects'

export const createProjectAction = async (
  { request }: ActionFunctionArgs,
  isFirstProject?: boolean
) => {
  const formData = await request.formData()
  const icon = formData.get('icon') as Icons
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const invites = formData.get('invites') as string

  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  const result = await createProject(token, { icon, name, slug, invites })
  if (!result) return redirectWithToast(`/`, 'Cannot create project')

  return redirectWithToast(
    `/${result.slug}`,
    'Project created successfully.',
    isFirstProject
      ? [
          ['Set-Cookie', await projectCookie.serialize(result?.slug)],
          ['Set-Cookie', await sidebarCookie.serialize(true)],
        ]
      : {}
  )
}
