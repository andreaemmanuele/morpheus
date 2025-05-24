export default `
    CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        picture TEXT DEFAULT '',
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);`
