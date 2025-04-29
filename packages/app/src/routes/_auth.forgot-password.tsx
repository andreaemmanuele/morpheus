import type { MetaFunction } from '@remix-run/node'
import { useActionData, useNavigation } from '@remix-run/react'
import { guestRouteGuardLoader } from '@/loaders/auth'
import { recoverPasswordAction } from '@/actions/auth/recover-password'
import { MailCheck } from 'lucide-react'
import { ForgotPasswordForm } from '@/components/forms/forgot-password-form'
import { Alert } from '@/components/atoms/alert'

export const loader = guestRouteGuardLoader
export const action = recoverPasswordAction

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Get your password back' },
]

export default function ForgotPasswordPage() {
  const data = useActionData<typeof action>()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <>
      {data && !isSubmitting && (
        <Alert
          title="Success"
          description={data.message}
          icon={<MailCheck className="h-4 w-4" />}
        />
      )}
      <ForgotPasswordForm submitting={isSubmitting} />
    </>
  )
}
