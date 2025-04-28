export default `
    CREATE TABLE IF NOT EXISTS invites (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        status invite_status DEFAULT 'pending',
        project_id INTEGER NOT NULL references projects(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
