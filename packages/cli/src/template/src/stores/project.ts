import type { ProjectDetails } from '@/types'
import { create } from 'zustand'

type ProjectStore = {
  project: ProjectDetails | null
  setProject: (data: ProjectDetails) => void
}

export const projectStore = create<ProjectStore>()((set) => ({
  project: null,
  setProject: (data) => set(() => ({ project: data })),
}))
