import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { deleteTeamMember } from '@/lib/projects'
import { authCookie } from '@/cookies.server'
import { redirectWithToast } from '@/lib/toast'

export const deleteMemberAction = async ({ request }: ActionFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  const formData = await request.formData()
  const projectSlug = formData.get('slug') as string
  const userId = formData.get('id') as string

  const response = await deleteTeamMember(token, projectSlug, userId)
  if (!response) {
    return redirectWithToast(
      request.headers.get('referer') as string,
      'Cannot remove member'
    )
  }

  return redirectWithToast(
    request.headers.get('referer') as string,
    'Member removed successfully'
  )
}
