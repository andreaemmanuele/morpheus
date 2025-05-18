export default `
    CREATE TABLE IF NOT EXISTS projects_users_roles (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL references projects(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL references users(id) ON DELETE CASCADE,
      role_id INTEGER NOT NULL references roles(id),
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
