import createUser from '../queries/users/create-user.js'
import findUserByEmail from '../queries/users/find-user-by-email.js'
import findUserById from '../queries/users/find-user-by-id.js'
import findUserByResetToken from '../queries/users/find-user-by-reset-token.js'
import findUserBySuspendedToken from '../queries/users/find-user-by-suspended-token.js'
import updateResetTokenAndExpiration from '../queries/users/update-reset-token-and-expiration.js'
import updatePassword from '../queries/users/update-password.js'
import updateStatus from '../queries/users/update-status.js'
import updateSuspendedToken from '../queries/users/update-suspended-token.js'
import updateLastLogin from '../queries/users/update-last-login.js'
import incrementLoginAttempts from '../queries/users/increment-login-attempts.js'
import resetLoginAttempts from '../queries/users/reset-login-attempts.js'

export const queries = {
  user: {
    createUser,
    findUserByEmail,
    findUserById,
    findUserByResetToken,
    findUserBySuspendedToken,
    updateResetTokenAndExpiration,
    updatePassword,
    updateStatus,
    updateSuspendedToken,
    updateLastLogin,
    incrementLoginAttempts,
    resetLoginAttempts,
  },
}
