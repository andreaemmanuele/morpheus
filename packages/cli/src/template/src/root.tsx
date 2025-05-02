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
import 'sonner/dist/styles.css'
import '@/assets/css/index.css'
import { useMemo } from 'react'
import { toastLoader } from '@/loaders/toast'
import { themeLoader } from '@/loaders/theme'
import { cn, getSystemPreferredTheme } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

export const loader = async (data: LoaderFunctionArgs) => {
  const theme = await themeLoader(data)
  const toast = await toastLoader(data)
  return { theme, toast: await toast.json() }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>()

  const currentTheme = useMemo(
    () => (!data?.theme ? getSystemPreferredTheme() : data?.theme),
    [data?.theme]
  )

  useToast(data?.toast)

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
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
