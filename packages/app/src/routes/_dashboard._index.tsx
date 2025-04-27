import type { MetaFunction } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { softRouteGuard } from '@/loaders/auth'
import { DashboardTemplate } from '@/components/templates/dashboard'
import { redirect } from '@remix-run/server-runtime'
import { themeCookie } from '@/cookies.server'
import { useLoaderData } from '@remix-run/react'

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Morpheus dashboard' },
]

export const loader = async (data: LoaderFunctionArgs) => {
  const isLoggedIn = await softRouteGuard(data)
  if (!isLoggedIn) return redirect('/')
  const headers = data.request.headers.get('Cookie')
  const cookie = await themeCookie.parse(headers)
  return { theme: cookie }
}

export default function DashboardPage() {
  const { theme } = useLoaderData<typeof loader>()
  return <DashboardTemplate theme={theme}>content</DashboardTemplate>
}
