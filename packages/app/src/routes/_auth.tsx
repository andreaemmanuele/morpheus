import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { Outlet, useLoaderData } from '@remix-run/react'
import { ThemeSwitcher } from '@/components/atoms/theme-switcher'
import { themeCookie } from '@/cookies.server'

export const loader = async (data: LoaderFunctionArgs) => {
  const headers = data.request.headers.get('Cookie')
  const cookie = await themeCookie.parse(headers)
  return { theme: cookie }
}

export default function Layout() {
  const data = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex justify-end">
        <ThemeSwitcher current={data.theme} />
      </div>
      <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm space-y-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
