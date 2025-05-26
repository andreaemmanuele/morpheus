import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { deleteFiles } from '@/lib/storage'
import { authCookie } from '@/cookies.server'
import { redirectWithToast } from '@/lib/toast'

export const deleteFilesAction = async ({ request }: ActionFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)
  const formData = await request.formData()
  const fileIds = formData.get('fileIds') as string
  const response = await deleteFiles(token, fileIds.split(','))
  if (!response) {
    return redirectWithToast(
      request.headers.get('referer') as string,
      'Cannot delete files'
    )
  }

  return redirectWithToast(
    request.headers.get('referer') as string,
    'Files deleted successfully'
  )
}
