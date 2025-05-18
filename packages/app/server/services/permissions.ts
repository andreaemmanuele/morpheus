import type { Permission, PermissionCheck, Permissions } from '@/server/types'
import { executeQuery } from '@/server/utils/db'
import { queries } from '@/server/queries'

export const checkPermission = async (
  userId: number,
  projectId: number,
  code: Permissions
) => {
  const result = await executeQuery<PermissionCheck>(
    queries.permissions.checkPermission,
    [userId, projectId, code]
  )
  return result.rows[0]?.has_permission || false
}

export const getPermissionCodesByRoleId = async (roleId: number) => {
  const result = await executeQuery<Permission>(
    queries.permissions.getPermissionCodesByRoleId,
    [roleId]
  )
  return result.rows
}
