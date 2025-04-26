import { queries as sharedQueries } from '@morpheus/shared/queries'
import createRolesTable from '../queries/migrations/create-roles-table.js'
import createUserStatusEnum from '../queries/migrations/create-user-status-enum.js'
import createUsersTable from '../queries/migrations/create-users-table.js'
import createPermissionsTable from '../queries/migrations/create-permissions-table.js'
import createRolesPermissionsTable from '../queries/migrations/create-roles-permissions-table.js'
import createRefreshTokensTable from '../queries/migrations/create-refresh-tokens-table.js'
import createRefreshToken from '../queries/refresh-tokens/create-refresh-token.js'
import findRefreshToken from '../queries/refresh-tokens/find-refresh-token.js'
import revokeRefreshToken from '../queries/refresh-tokens/revoke-refresh-token.js'

export const queries = {
  migrations: [
    createRolesTable,
    createUserStatusEnum,
    createUsersTable,
    createPermissionsTable,
    createRolesPermissionsTable,
    createRefreshTokensTable,
  ],
  auth: {
    ...sharedQueries.user,
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
  },
}
