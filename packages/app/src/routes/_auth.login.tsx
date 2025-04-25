import type { MetaFunction } from '@remix-run/node'
import { useActionData, useNavigation } from '@remix-run/react'
import { guestRouteGuard } from '@/loaders/auth'
import { login } from '@/actions/login'
import { AlertCircle } from 'lucide-react'
import { LoginForm } from '@/components/forms/login-form'
import { Alert } from '@/components/atoms/alert'

export const loader = guestRouteGuard
export const action = login

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Welcome to Morpheus' },
]

export default function LoginPage() {
  const data = useActionData<typeof action>()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <>
      {data && (
        <Alert
          title="Error"
          description={data.error}
          icon={<AlertCircle className="h-4 w-4" />}
        />
      )}
      <LoginForm submitting={isSubmitting} />
    </>
  )
}
