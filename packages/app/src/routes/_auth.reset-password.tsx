import type { MetaFunction } from '@remix-run/node'
import { useActionData, useNavigation } from '@remix-run/react'
import { guestRouteGuard } from '@/loaders/auth'
import { AlertCircle } from 'lucide-react'
import { ResetPasswordForm } from '@/components/forms/reset-password-form'
import { Alert } from '@/components/atoms/alert'

export const loader = guestRouteGuard

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Reset your password' },
]

export default function ResetPasswordPage() {
  /*const data = useActionData<typeof action>()*/
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <>
      {/*{data && (
          <Alert
            title="Error"
            description={data.error}
            icon={<AlertCircle className="h-4 w-4" />}
          />
        )}*/}
      <ResetPasswordForm submitting={isSubmitting} />
    </>
  )
}
