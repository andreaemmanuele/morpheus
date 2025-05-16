import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { changePasswordSchema } from '@morphe.us/shared/schemas'
import { joinProject } from '@/lib/projects'
import type { Icons } from '@/lib/icons'

export const joinProjectAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData()
  const username = formData.get('username') as Icons
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm-password') as string
  const { token } = params as { token: string }

  const { error: validationError } = changePasswordSchema.safeParse({
    password,
    confirmPassword,
  })

  if (validationError) {
    return { error: validationError.errors[0]?.message, message: null }
  }

  const response = await joinProject(token, username, password, confirmPassword)
  if (response.error) return { error: response.error }
  return redirect('/login?message=project-joined')
}
