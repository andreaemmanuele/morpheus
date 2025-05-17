import { queries as sharedQueries } from '@morphe.us/shared/queries'
import createRolesTable from '@/server/queries/migrations/create-roles-table.js'
import createUserStatusEnum from '@/server/queries/migrations/create-user-status-enum.js'
import createUsersTable from '@/server/queries/migrations/create-users-table.js'
import createPermissionsTable from '@/server/queries/migrations/create-permissions-table.js'
import createRolesPermissionsTable from '@/server/queries/migrations/create-roles-permissions-table.js'
import createRefreshTokensTable from '@/server/queries/migrations/create-refresh-tokens-table.js'
import createProjectsTable from '@/server/queries/migrations/create-projects-table.js'
import createInvitesStatusEnum from '@/server/queries/migrations/create-invites-status-enum.js'
import createInvitesTable from '@/server/queries/migrations/create-invites-table.js'
import createProjectsUsersRolesTable from '@/server/queries/migrations/create-projects-users-roles-table.js'
import createRefreshToken from '@/server/queries/refresh-tokens/create-refresh-token.js'
import findRefreshToken from '@/server/queries/refresh-tokens/find-refresh-token.js'
import findRefreshTokenByUserId from '@/server/queries/refresh-tokens/find-refresh-token-by-user-id.js'
import revokeRefreshToken from '@/server/queries/refresh-tokens/revoke-refresh-token.js'
import checkPermissionFn from '@/server/queries/permissions/check-permission-fn.js'

export const queries = {
  migrations: [
    createRolesTable,
    createUserStatusEnum,
    createUsersTable,
    createPermissionsTable,
    createRolesPermissionsTable,
    createRefreshTokensTable,
    createProjectsTable,
    createInvitesStatusEnum,
    createInvitesTable,
    createProjectsUsersRolesTable,
  ],
  auth: {
    ...sharedQueries.user,
    createRefreshToken,
    findRefreshToken,
    findRefreshTokenByUserId,
    revokeRefreshToken,
  },
  project: {
    ...sharedQueries.project,
  },
  invites: {
    ...sharedQueries.invites,
  },
  permissions: {
    ...sharedQueries.permissions,
    checkPermissionFn,
  },
}
