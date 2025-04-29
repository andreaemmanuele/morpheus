export default `SELECT * FROM projects_users_roles 
                JOIN projects ON projects_users_roles.project_id = projects.id 
                WHERE user_id = $1`
