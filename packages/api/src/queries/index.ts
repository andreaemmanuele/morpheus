import createUsersTable from '@/src/queries/migrations/create-users-table'
import createRefreshTokensTable from '@/src/queries/migrations/create-refresh-tokens-table'
import createUser from '@/src/queries/users/create-user'
import findUserByEmail from '@/src/queries/users/find-user-by-email'
import findUserById from '@/src/queries/users/find-user-by-id'
import updateLastLogin from '@/src/queries/users/update-last-login'
import incrementLoginAttempts from '@/src/queries/users/increment-login-attempts'
import createRefreshToken from '@/src/queries/refresh-tokens/create-refresh-token'
import findRefreshToken from '@/src/queries/refresh-tokens/find-refresh-token'
import revokeRefreshToken from '@/src/queries/refresh-tokens/revoke-refresh-token'
import createRolesTable from '@/src/queries/migrations/create-roles-table'
import createPermissionsTable from '@/src/queries/migrations/create-permissions-table'
import createRolesPermissionsTable from '@/src/queries/migrations/create-roles-permissions-table'
import createUserStatusEnum from '@/src/queries/migrations/create-user-status-enum'

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
