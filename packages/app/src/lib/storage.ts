import type { File as StorageFile } from '@/server/types'

export const uploadFiles = async (
  token: string,
  formData: FormData
): Promise<StorageFile[] | null> => {
  const apiFormData = new FormData()

  const files = formData.getAll('files') as File[]
  files.forEach((file) => {
    apiFormData.append('files', file)
  })
  let response
  try {
    response = await fetch(`${process.env.BASE_URL}/api/files/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: apiFormData,
    })
  } catch (error) {
    console.error(error)
  }

  const result = await response?.json()
  if (!response?.ok) return null
  return result
}
