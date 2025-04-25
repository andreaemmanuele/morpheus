import type { MetaFunction } from '@remix-run/node'
import { authRouteGuard } from '@/loaders/auth'

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Morpheus dashboard' },
]

export const loader = authRouteGuard

export default function DashboardPage() {
  return <div>dashboard</div>
}
