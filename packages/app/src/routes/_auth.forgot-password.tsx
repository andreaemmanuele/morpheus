import type { MetaFunction } from '@remix-run/node'
import { useActionData, useNavigation } from '@remix-run/react'
import { guestRouteGuard } from '@/loaders/auth'
import { recoverPassword } from '@/actions/recover-password'
import { AlertCircle } from 'lucide-react'
import { ForgotPasswordForm } from '@/components/forms/forgot-password-form'
import { Alert } from '@/components/atoms/alert'

export const loader = guestRouteGuard
export const action = recoverPassword

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Get your password back' },
]

export default function ForgotPasswordPage() {
  const data = useActionData<typeof action>()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <>
      {data && (
        <Alert
          title="Success"
          description={data.message}
          icon={<AlertCircle className="h-4 w-4" />}
        />
      )}
      <ForgotPasswordForm submitting={isSubmitting} />
    </>
  )
}
