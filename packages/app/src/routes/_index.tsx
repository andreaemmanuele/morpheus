import type { MetaFunction } from '@remix-run/node'
import { authRouteGuard } from '@/loaders/auth'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export const loader = authRouteGuard

export default function DashboardPage() {
  return <div>dashboard</div>
}
