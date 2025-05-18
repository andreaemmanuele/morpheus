export default `SELECT user_id FROM projects_users_roles WHERE project_id = $1 AND user_id = $2`
