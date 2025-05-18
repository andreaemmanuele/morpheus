export default `SELECT code FROM roles_permissions JOIN permissions ON roles_permissions.permission_id = permissions.id WHERE role_id = $1`
