import createUsersTable from '@/src/queries/migrations/create-users-table.js'
import createRefreshTokensTable from '@/src/queries/migrations/create-refresh-tokens-table.js'
import createUser from '@/src/queries/users/create-user.js'
import findUserByEmail from '@/src/queries/users/find-user-by-email.js'
import findUserById from '@/src/queries/users/find-user-by-id.js'
import updateLastLogin from '@/src/queries/users/update-last-login.js'
import incrementLoginAttempts from '@/src/queries/users/increment-login-attempts.js'
import createRefreshToken from '@/src/queries/refresh-tokens/create-refresh-token.js'
import findRefreshToken from '@/src/queries/refresh-tokens/find-refresh-token.js'
import revokeRefreshToken from '@/src/queries/refresh-tokens/revoke-refresh-token.js'
import createRolesTable from '@/src/queries/migrations/create-roles-table.js'
import createPermissionsTable from '@/src/queries/migrations/create-permissions-table.js'
import createRolesPermissionsTable from '@/src/queries/migrations/create-roles-permissions-table.js'
import createUserStatusEnum from '@/src/queries/migrations/create-user-status-enum.js'

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
    createUser,
    findUserByEmail,
    findUserById,
    updateLastLogin,
    incrementLoginAttempts,
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
  },
}
