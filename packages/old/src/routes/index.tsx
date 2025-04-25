import { LoaderFunctionArgs } from 'react-router'
import { authRouteGuard } from '@/loaders/auth.ts'

export async function loader(data: LoaderFunctionArgs) {
  return await authRouteGuard(data)
}

export default function IndexPage() {
  return <div>dashboard</div>
}
