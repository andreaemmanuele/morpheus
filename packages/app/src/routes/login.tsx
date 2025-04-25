import { useActionData, useNavigation } from '@remix-run/react'
import { guestRouteGuard } from '@/loaders/auth'
import { login } from '@/actions/login'
import { LoginForm } from '@/components/login-form'

export const loader = guestRouteGuard
export const action = login

export default function LoginPage() {
  const data = useActionData<typeof action>()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {data && data.error}
        <LoginForm submitting={isSubmitting} />
      </div>
    </div>
  )
}
