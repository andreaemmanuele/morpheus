import type { MetaFunction } from '@remix-run/node'
import { useActionData, useNavigation } from '@remix-run/react'
import { guestRouteGuardLoader } from '@/loaders/auth'
import { resetPasswordAction } from '@/actions/auth/reset-password'
import { AlertCircle, CircleCheckBig } from 'lucide-react'
import { ResetPasswordForm } from '@/components/forms/reset-password-form'
import { Alert } from '@/components/atoms/alert'

export const loader = guestRouteGuardLoader
export const action = resetPasswordAction

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Reset your password' },
]

export default function ResetPasswordPage() {
  const data = useActionData<typeof action>()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <>
      {data && (
        <Alert
          title={!!data.error ? 'Error' : 'Success'}
          description={!!data.error ? data.error : data.message}
          icon={
            !!data.error ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CircleCheckBig className="h-4 w-4" />
            )
          }
        />
      )}
      <ResetPasswordForm submitting={isSubmitting} />
    </>
  )
}
