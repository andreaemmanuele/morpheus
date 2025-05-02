export default `
        INSERT INTO projects_users_roles (project_id, user_id, role_id)
        VALUES ($1, $2, $3)`
