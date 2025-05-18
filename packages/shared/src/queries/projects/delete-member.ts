export default `DELETE FROM projects_users_roles WHERE project_id = $1 AND user_id = $2 AND role_id != 1`
