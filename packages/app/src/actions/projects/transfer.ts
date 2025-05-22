import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { authCookie } from '@/cookies.server'
import { updateOwner } from '@/lib/projects'
import { redirectWithToast } from '@/lib/toast'

export const transferProjectAction = async ({
  request,
}: ActionFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  const formData = await request.formData()
  const slug = formData.get('slug') as string
  const userId = formData.get('userId') as string
  const response = await updateOwner(token, slug, userId)
  if (!response) {
    return redirectWithToast(`/${slug}/settings`, 'Cannot transfer project')
  }

  return redirectWithToast(
    `/${slug}/settings`,
    'Project transferred successfully.'
  )
}
