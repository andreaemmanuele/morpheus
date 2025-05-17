type ContentOperations = 'create' | 'read' | 'update' | 'delete' | 'publish'
type UserOperations = 'invite' | 'remove' | 'update_roles'
type ProjectOperations = 'update' | 'delete'

export type Permissions =
  | `content.${ContentOperations}`
  | `users.${UserOperations}`
  | `project.${ProjectOperations}`
