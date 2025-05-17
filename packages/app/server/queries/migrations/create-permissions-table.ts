export default `
    CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        category VARCHAR(30) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO permissions (code, description, category) VALUES
      -- Content permissions
      ('content.create', 'Create new content', 'content'),
      ('content.read', 'View content', 'content'),
      ('content.update', 'Edit content', 'content'),
      ('content.delete', 'Delete content', 'content'),
      ('content.publish', 'Publish content', 'content'),
      
      -- User management
      ('users.invite', 'Invite users to project', 'users'),
      ('users.remove', 'Remove users from project', 'users'),
      ('users.update_roles', 'Change user roles', 'users'),
      
      -- Project settings
      ('project.update', 'Update project settings', 'project'),
      ('project.delete', 'Delete project', 'project')
      ON CONFLICT (code) DO NOTHING;
      
      -- Assign permissions to roles
      -- Owner role
          INSERT INTO roles_permissions (role_id, permission_id)
          SELECT 1, id FROM permissions
          ON CONFLICT DO NOTHING;
      
      -- Admin role
          INSERT INTO roles_permissions (role_id, permission_id)
          SELECT 2, id FROM permissions WHERE code != 'project.delete'
          ON CONFLICT DO NOTHING;

      -- Editor role 
          INSERT INTO roles_permissions (role_id, permission_id)
          SELECT 3, id FROM permissions WHERE category = 'content'
          ON CONFLICT DO NOTHING;
`
