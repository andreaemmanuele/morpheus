import type { MetaFunction } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { softRouteGuardLoader } from '@/loaders/auth'
import { loginAction } from '@/actions/auth/login'
import { AlertCircle, MessageSquareText } from 'lucide-react'
import { LoginForm } from '@/components/forms/login-form'
import { Alert } from '@/components/atoms/alert'
import { renderAlertMessage } from '@/lib/alert'

export const loader = async (data: LoaderFunctionArgs) => {
  const { isLoggedIn } = await softRouteGuardLoader(data)
  if (isLoggedIn) return redirect('/')
  const url = new URL(data.request.url)
  const message = url.searchParams.get('message')
  if (!message) return null
  return renderAlertMessage(message)
}

export const action = loginAction

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Welcome to Morpheus' },
]

export default function LoginPage() {
  const message = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <>
      {!data && message && (
        <Alert
          title="Message"
          description={message}
          icon={<MessageSquareText className="h-4 w-4" />}
        />
      )}
      {data && !isSubmitting && (
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
