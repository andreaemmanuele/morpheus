import type { MetaFunction } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { authRouteGuard } from '@/loaders/auth'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export async function loader(data: LoaderFunctionArgs) {
  return await authRouteGuard(data)
}

export default function DashboardPage() {
  return <div>dashboard</div>
}
