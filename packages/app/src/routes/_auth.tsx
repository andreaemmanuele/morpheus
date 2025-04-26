import { Outlet } from '@remix-run/react'

export default function Layout() {
  return (
    <div className="flex min-h-[calc(100svh_-_2.25rem)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-8">
        <Outlet />
      </div>
    </div>
  )
}
