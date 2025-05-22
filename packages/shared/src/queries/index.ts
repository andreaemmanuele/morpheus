import createUser from '../queries/users/create-user.js'
import findUserByEmail from '../queries/users/find-user-by-email.js'
import findUserById from '../queries/users/find-user-by-id.js'
import findUserByResetToken from '../queries/users/find-user-by-reset-token.js'
import findUserBySuspendedToken from '../queries/users/find-user-by-suspended-token.js'
import updateResetTokenAndExpiration from '../queries/users/update-reset-token-and-expiration.js'
import updateUsername from '../queries/users/update-username.js'
import updatePassword from '../queries/users/update-password.js'
import updateStatus from '../queries/users/update-status.js'
import updateSuspendedToken from '../queries/users/update-suspended-token.js'
import updateLastLogin from '../queries/users/update-last-login.js'
import incrementLoginAttempts from '../queries/users/increment-login-attempts.js'
import resetLoginAttempts from '../queries/users/reset-login-attempts.js'
import findAllByUserId from '../queries/projects/find-all-by-user-id.js'
import findProjectBySlug from '../queries/projects/find-project-by-slug.js'
import findProjectBySlugAndUserId from '../queries/projects/find-project-by-slug-and-user-id.js'
import createProject from '../queries/projects/create-project.js'
import createProjectsUsersRolesRelation from '../queries/projects/create-projects-users-roles-relation.js'
import checkIfMemberExists from '../queries/projects/check-if-member-exists.js'
import updateProject from '../queries/projects/update-project.js'
import updateUserRole from '../queries/projects/update-user-role.js'
import getProjectTeam from '../queries/projects/get-project-team.js'
import getProjectIdBySlug from '../queries/projects/get-project-id-from-slug.js'
import deleteMember from '../queries/projects/delete-member.js'
import deleteProject from '../queries/projects/delete-project.js'
import createInvites from '../queries/invites/create-invites.js'
import getExistingInvites from '../queries/invites/get-existing-invites.js'
import findInviteByToken from '../queries/invites/find-invite-by-token.js'
import revokeInviteByToken from '../queries/invites/revoke-invite-by-token.js'
import revokeInviteByUserId from '../queries/invites/revoke-invite-by-user-id.js'
import checkPermission from '../queries/permissions/check-permission.js'
import getPermissionCodesByRoleId from '../queries/permissions/get-permission-codes-by-role-id.js'
import getAllRoles from '../queries/roles/get-all-roles.js'

export const queries = {
  user: {
    createUser,
    findUserByEmail,
    findUserById,
    findUserByResetToken,
    findUserBySuspendedToken,
    updateResetTokenAndExpiration,
    updateUsername,
    updatePassword,
    updateStatus,
    updateSuspendedToken,
    updateLastLogin,
    incrementLoginAttempts,
    resetLoginAttempts,
  },
  project: {
    findAllByUserId,
    findProjectBySlug,
    findProjectBySlugAndUserId,
    createProject,
    createProjectsUsersRolesRelation,
    checkIfMemberExists,
    updateProject,
    updateUserRole,
    getProjectTeam,
    getProjectIdBySlug,
    deleteMember,
    deleteProject,
  },
  invites: {
    createInvites,
    getExistingInvites,
    findInviteByToken,
    revokeInviteByToken,
    revokeInviteByUserId,
  },
  permissions: {
    checkPermission,
    getPermissionCodesByRoleId,
  },
  roles: {
    getAllRoles,
  },
}
