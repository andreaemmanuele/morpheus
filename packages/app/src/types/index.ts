import type { Icons } from '@/lib/icons'

export type BreadcrumbItem = {
  id: number
  name: string
  url?: string
}

export type ProjectDetails = {
  id: number
  icon: Icons
  name: string
  slug: string
}
