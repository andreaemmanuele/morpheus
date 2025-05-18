export default `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM permissions LIMIT 1) THEN
            INSERT INTO permissions (code, description, category) VALUES
            ('content.create', 'Create new content', 'content'),
            ('content.read', 'View content', 'content'),
            ('content.update', 'Edit content', 'content'),
            ('content.delete', 'Delete content', 'content'),
            ('content.publish', 'Publish content', 'content'),
            ('users.invite', 'Invite users to project', 'users'),
            ('users.remove', 'Remove users from project', 'users'),
            ('users.update_roles', 'Change user roles', 'users'),
            ('project.leave', 'Leave project if user is not the owner', 'project'),
            ('project.update', 'Update project settings', 'project'),
            ('project.transfer', 'Transfer project to another member', 'project'),
            ('project.delete', 'Delete project', 'project');
            
            -- Assign permissions to roles
            -- Owner role
            INSERT INTO roles_permissions (role_id, permission_id)
            SELECT 1, id FROM permissions WHERE code != 'project.leave';
            
            -- Admin role
            INSERT INTO roles_permissions (role_id, permission_id)
            SELECT 2, id FROM permissions WHERE code != 'project.delete' AND code != 'project.transfer';
            
            -- Editor role 
            INSERT INTO roles_permissions (role_id, permission_id)
            SELECT 3, id FROM permissions WHERE category = 'content' OR code = 'project.leave';
        END IF;
    END
    $$;
`
