export default `
    CREATE OR REPLACE FUNCTION user_has_permission(
      p_user_id INTEGER,
      p_project_id INTEGER,
      p_permission_code TEXT
    ) RETURNS BOOLEAN AS $$
    DECLARE
      has_permission BOOLEAN;
    BEGIN
      SELECT EXISTS (
        SELECT 1
        FROM projects_users_roles pur
        JOIN roles_permissions rp ON pur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE pur.user_id = p_user_id
          AND pur.project_id = p_project_id
          AND p.code = p_permission_code
      ) INTO has_permission;
      
      RETURN has_permission;
    END;
    $$ LANGUAGE plpgsql;
`
