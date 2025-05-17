import type { Permission, Permissions } from '@/server/types'
import { executeQuery } from '@/server/utils/db'
import { queries } from '@/server/queries'

export const checkPermission = async (
  userId: number,
  projectId: number,
  code: Permissions
) => {
  const result = await executeQuery<Permission>(
    queries.permissions.checkPermission,
    [userId, projectId, code]
  )
  return result.rows[0]?.has_permission || false
}
