import type { ActionFunctionArgs } from '@remix-run/node'
import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node'
import { authCookie } from '@/cookies.server'
import { redirectWithToast } from '@/lib/toast'
import { associateFilesToProject, updateProject } from '@/lib/projects'
import { uploadFiles } from '@/lib/storage'

export const projectUploadPictureAction = async ({
  request,
}: ActionFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createMemoryUploadHandler({ maxPartSize: 50 * 1024 * 1024 }) // 50MB limit
  )

  const formData = await unstable_parseMultipartFormData(request, uploadHandler)
  let response = await uploadFiles(token, formData)

  if (!response) {
    return redirectWithToast(
      request.headers.get('referer') as string,
      'Failed to upload picture'
    )
  }

  const picture = response[0]?.url
  const slug = formData.get('slug') as string
  if (!slug) {
    return redirectWithToast(
      request.headers.get('referer') as string,
      'Failed to associate picture to project'
    )
  }

  response = await associateFilesToProject(
    token,
    slug,
    response.map((file) => file.id),
    'pictures'
  )

  if (!response) {
    return redirectWithToast(
      request.headers.get('referer') as string,
      'Failed to associate picture to project'
    )
  }

  response = await updateProject(token, slug, null, picture)
  if (!response) {
    return redirectWithToast(
      request.headers.get('referer') as string,
      'Cannot update project picture'
    )
  }

  return redirectWithToast(
    request.headers.get('referer') as string,
    'Picture uploaded successfully'
  )
}
