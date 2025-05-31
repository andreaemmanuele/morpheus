import type { ActionFunctionArgs } from '@remix-run/node'
import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node'
import { authCookie } from '@/cookies.server'
import { redirectWithToast } from '@/lib/toast'
import { uploadFiles } from '@/lib/storage'
import { associateFilesToProject } from '@/lib/projects'
import { fileSchema } from '@/server/schemas/files'
import { z } from 'zod'

export const projectUploadAction = async ({ request }: ActionFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createMemoryUploadHandler({ maxPartSize: 50 * 1024 * 1024 }) // 50MB limit
  )

  const formData = await unstable_parseMultipartFormData(request, uploadHandler)
  const { success, error } = z
    .array(fileSchema)
    .safeParse(formData.getAll('files'))

  if (!success) {
    return redirectWithToast(
      request.headers.get('referer') as string,
      error.message
    )
  }

  let response = await uploadFiles(token, formData)

  if (!response) {
    return redirectWithToast(
      request.headers.get('referer') as string,
      'Failed to upload files'
    )
  }

  const slug = formData.get('slug') as string

  if (!slug) {
    return redirectWithToast(
      request.headers.get('referer') as string,
      'Failed to associate files to project'
    )
  }

  const category = formData.get('category') as string
  const fileIds = response.map((file) => file.id)
  response = await associateFilesToProject(token, slug, fileIds, category)

  if (!response) {
    return redirectWithToast(
      request.headers.get('referer') as string,
      'Failed to associate files to project'
    )
  }

  return redirectWithToast(
    request.headers.get('referer') as string,
    'Files uploaded successfully'
  )
}
