import type { Permissions } from '@/server/types'
import { useMemo } from 'react'
import { projectStore } from '@/stores/project'
import { sessionStore } from '@/stores/session'

export const useUserHasPermission = (code: Permissions) => {
  const { session } = sessionStore()
  const { project } = projectStore()

  const permissions = useMemo(() => {
    if (!project || !project.id) return []
    return session?.user.permissions[project.id]
  }, [session, project])

  return {
    hasPermission: permissions?.includes(code) ?? false,
  }
}
