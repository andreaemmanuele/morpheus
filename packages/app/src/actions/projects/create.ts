import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { authCookie, sidebarCookie, projectCookie } from '@/cookies.server'
import { redirectWithToast } from '@/lib/toast'

export const createProjectAction = async (
  { request }: ActionFunctionArgs,
  isFirstProject?: boolean
) => {
  const formData = await request.formData()
  const icon = formData.get('icon')
  const name = formData.get('name')
  const slug = formData.get('slug')
  const invites = formData.get('invites')

  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  const response = await fetch(`${process.env.BASE_URL}/api/projects/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      icon,
      name,
      slug,
      invites,
    }),
  })

  const result = await response.json()
  if (!response.ok) return { error: result.error, message: null }

  return redirectWithToast(
    `/${result.slug}`,
    'Project created successfully.',
    isFirstProject
      ? [
          ['Set-Cookie', await projectCookie.serialize(result.slug)],
          ['Set-Cookie', await sidebarCookie.serialize(true)],
        ]
      : {}
  )
}
