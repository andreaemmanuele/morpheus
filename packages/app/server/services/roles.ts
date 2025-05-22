import type { Role } from '@/server/types'
import { queries } from '@/server/queries'
import { executeQuery } from '@/server/utils/db'

export const getAllRoles = async () => {
  const result = await executeQuery<Role[]>(queries.roles.getAllRoles)
  return result.rows
}
