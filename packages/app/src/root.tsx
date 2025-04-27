import * as React from 'react'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import '@/assets/css/index.css'
import { useMemo } from 'react'
import { themeCookie } from '@/cookies.server'
import { cn, getSystemPreferredTheme } from '@/lib/utils'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers.get('Cookie')
  const cookie = await themeCookie.parse(headers)
  return { theme: cookie }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useLoaderData<typeof loader>()

  const currentTheme = useMemo(
    () => (!theme ? getSystemPreferredTheme() : theme),
    [theme]
  )

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>Morpheus CMS</title>
      </head>
      <body
        className={cn('transition-colors duration-300', {
          dark: currentTheme === 'dark',
        })}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
