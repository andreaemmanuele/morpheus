export default `
    INSERT INTO projects (icon, name, slug, is_default)
    VALUES ($1, $2, $3, COALESCE($4, NOT EXISTS(
                                        SELECT 1
                                        FROM projects p
                                        JOIN projects_users_roles upr ON p.id = upr.project_id
                                        WHERE upr.user_id = $5))
    )
    RETURNING id, icon, name, slug, is_default`
