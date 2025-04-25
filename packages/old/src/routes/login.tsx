import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useActionData,
} from 'react-router'
import { LoginForm } from '@/components/login-form'
import { guestRouteGuard } from '@/loaders/auth.ts'
import { login } from '@/actions/login.ts'

export async function loader(data: LoaderFunctionArgs) {
  return await guestRouteGuard(data)
}

export async function action(data: ActionFunctionArgs) {
  return await login(data)
}

export default function Project() {
  const data = useActionData<{ error: string }>()
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {data && data.error}
        <LoginForm />
      </div>
    </div>
  )
}
