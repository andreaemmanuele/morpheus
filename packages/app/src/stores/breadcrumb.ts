import type { BreadcrumbItem } from '@/types'
import { create } from 'zustand'

type BreadcrumbStore = {
  breadcrumbItems: BreadcrumbItem[]
  setBreadcrumb: (data: BreadcrumbItem[]) => void
}

export const breadcrumbStore = create<BreadcrumbStore>()((set) => ({
  breadcrumbItems: [],
  setBreadcrumb: (data) => set(() => ({ breadcrumbItems: data })),
}))
