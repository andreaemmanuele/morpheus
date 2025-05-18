import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { authCookie } from '@/cookies.server'
import { inviteMembers } from '@/lib/projects'
import { redirectWithToast } from '@/lib/toast'

export const inviteMemberAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const projectName = formData.get('name') as string
  const projectSlug = formData.get('slug') as string
  const email = formData.get('email') as string

  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  const response = await inviteMembers(token, projectName, projectSlug, email)
  if (!response) {
    return redirectWithToast(
      `/${projectSlug}/settings`,
      'Cannot invite members'
    )
  }

  return redirectWithToast(
    `/${projectSlug}/settings`,
    'Invite sent successfully'
  )
}
