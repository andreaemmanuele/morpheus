import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime'
import { useActionData } from '@remix-run/react'
import { guestRouteGuard } from '@/loaders/auth'
import { login } from '@/actions/login'
import { LoginForm } from '@/components/login-form'

export async function loader(data: LoaderFunctionArgs) {
  return await guestRouteGuard(data)
}

export async function action(data: ActionFunctionArgs) {
  return await login(data)
}

export default function LoginPage() {
  const data = useActionData<{ error: string }>()
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {data && JSON.stringify(data, null, 2)}
        <LoginForm />
      </div>
    </div>
  )
}
