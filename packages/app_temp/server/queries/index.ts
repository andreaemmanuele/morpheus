import createUsersTable from '../queries/migrations/create-users-table.js'
import createRefreshTokensTable from '../queries/migrations/create-refresh-tokens-table.js'
import createUser from '../queries/users/create-user.js'
import findUserByEmail from '../queries/users/find-user-by-email.js'
import findUserById from '../queries/users/find-user-by-id.js'
import findUserBySuspendedToken from '../queries/users/find-user-by-suspended-token.js'
import updateStatus from '../queries/users/update-status.js'
import updateSuspendedToken from '../queries/users/update-suspended-token.js'
import updateLastLogin from '../queries/users/update-last-login.js'
import incrementLoginAttempts from '../queries/users/increment-login-attempts.js'
import resetLoginAttempts from '../queries/users/reset-login-attempts.js'
import createRefreshToken from '../queries/refresh-tokens/create-refresh-token.js'
import findRefreshToken from '../queries/refresh-tokens/find-refresh-token.js'
import revokeRefreshToken from '../queries/refresh-tokens/revoke-refresh-token.js'
import createRolesTable from '../queries/migrations/create-roles-table.js'
import createPermissionsTable from '../queries/migrations/create-permissions-table.js'
import createRolesPermissionsTable from '../queries/migrations/create-roles-permissions-table.js'
import createUserStatusEnum from '../queries/migrations/create-user-status-enum.js'

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
    findUserBySuspendedToken,
    updateStatus,
    updateSuspendedToken,
    updateLastLogin,
    incrementLoginAttempts,
    resetLoginAttempts,
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
  },
}
