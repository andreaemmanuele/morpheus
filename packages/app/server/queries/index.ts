import { queries as sharedQueries } from '@morphe.us/shared/queries'
import createRolesTable from '@/server/queries/migrations/create-roles-table'
import createUserStatusEnum from '@/server/queries/migrations/create-user-status-enum'
import createUsersTable from '@/server/queries/migrations/create-users-table'
import createPermissionsTable from '@/server/queries/migrations/create-permissions-table'
import createRolesPermissionsTable from '@/server/queries/migrations/create-roles-permissions-table'
import insertPermissionValues from '@/server/queries/migrations/insert-permission-values'
import createRefreshTokensTable from '@/server/queries/migrations/create-refresh-tokens-table'
import createProjectsTable from '@/server/queries/migrations/create-projects-table'
import createInvitesStatusEnum from '@/server/queries/migrations/create-invites-status-enum'
import createInvitesTable from '@/server/queries/migrations/create-invites-table'
import createProjectsUsersRolesTable from '@/server/queries/migrations/create-projects-users-roles-table'
import createRefreshToken from '@/server/queries/refresh-tokens/create-refresh-token'
import findRefreshToken from '@/server/queries/refresh-tokens/find-refresh-token'
import findRefreshTokenByUserId from '@/server/queries/refresh-tokens/find-refresh-token-by-user-id'
import revokeRefreshToken from '@/server/queries/refresh-tokens/revoke-refresh-token'
import checkPermissionFn from '@/server/queries/permissions/check-permission-fn'
import createFilesTable from '@/server/queries/migrations/create-files-table'
import createProjectsFilesTable from '@/server/queries/migrations/create-projects-files-table'
import saveFile from '@/server/queries/files/save-file'
import associateFiles from '@/server/queries/projects/associate-files'

export const queries = {
  migrations: [
    createFilesTable,
    createRolesTable,
    createUserStatusEnum,
    createUsersTable,
    createPermissionsTable,
    createRolesPermissionsTable,
    insertPermissionValues,
    createRefreshTokensTable,
    createProjectsTable,
    createProjectsFilesTable,
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
    associateFiles,
  },
  invites: {
    ...sharedQueries.invites,
  },
  permissions: {
    ...sharedQueries.permissions,
    checkPermissionFn,
  },
  roles: {
    ...sharedQueries.roles,
  },
  files: {
    saveFile,
  },
}
