export default `
    CREATE TABLE IF NOT EXISTS roles_permissions (
      id SERIAL PRIMARY KEY,
      role_id INTEGER references roles(id) NOT NULL,
      permission_id INTEGER references permissions(id) NOT NULL
    );`
