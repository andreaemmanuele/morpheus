import createUsersTable from '@/src/queries/create-users-table.js'
import createUser from '@/src/queries/create-user.js'

export const queries = {
  auth: {
    createUsersTable,
    createUser,
  },
}
