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
import createProjectsTable from '../queries/migrations/create-projects-table.js'
import createInvitesStatusEnum from '../queries/migrations/create-invites-status-enum.js'
import createInvitesTable from '../queries/migrations/create-invites-table.js'
import createProjectsUsersRolesTable from '../queries/migrations/create-projects-users-roles-table.js'

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
    revokeRefreshToken,
  },
  project: {
    ...sharedQueries.project,
  },
}
