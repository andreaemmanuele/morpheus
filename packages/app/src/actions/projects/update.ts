import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { updateProject } from '@/lib/projects'
import { authCookie, toastCookie } from '@/cookies.server'

export const updateProjectAction = async ({ request }: ActionFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const token = await authCookie.parse(headers)

  const formData = await request.formData()
  const slug = formData.get('slug') as string
  const icon = formData.get('icon') as string
  const name = formData.get('name') as string

  const response = await updateProject(token, slug, icon, name)
  return Response.json(response, {
    headers: {
      'Set-Cookie': await toastCookie.serialize(
        response ? 'Project updated successfully' : 'Cannot update project'
      ),
    },
  })
}
