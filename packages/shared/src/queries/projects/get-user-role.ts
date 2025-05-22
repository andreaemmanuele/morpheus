export default `SELECT * FROM projects_users_roles JOIN roles ON projects_users_roles.role_id = roles.id WHERE project_id = $1 AND user_id = $2`
