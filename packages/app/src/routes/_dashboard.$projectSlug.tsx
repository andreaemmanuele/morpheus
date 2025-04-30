import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { useLoaderData } from '@remix-run/react'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { projectSlug } = params as { projectSlug: string }
  return projectSlug
}

export default function NewProjectPage() {
  const data = useLoaderData<typeof loader>()
  return <div>{data}</div>
}
