import type { FC } from 'react'
import type { Icons } from '@/lib/icons'

export type FCWithClassName<T = object> = FC<T & { className?: string }>
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

export type TeamMember = {
  id: string
  email: string
  role: 'owner' | 'admin' | 'editor'
  status: 'pending' | 'active'
}
