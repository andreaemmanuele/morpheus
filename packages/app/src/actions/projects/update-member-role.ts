import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { updateMemberRole } from '@/lib/projects'
import { authCookie } from '@/cookies.server'
import { redirectWithToast } from '@/lib/toast'

export const updateMemberRoleAction = async ({
  request,
}: ActionFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  const formData = await request.formData()
  const slug = formData.get('slug') as string
  const roleId = formData.get('roleId') as string
  const userId = formData.get('userId') as string

  const response = await updateMemberRole(token, slug, roleId, userId)
  if (!response) {
    return redirectWithToast(`/${slug}/settings`, 'Cannot update member role')
  }

  return redirectWithToast(
    `/${slug}/settings`,
    'Member role updated successfully'
  )
}
