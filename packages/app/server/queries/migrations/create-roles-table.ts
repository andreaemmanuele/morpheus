export default `
    CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    INSERT INTO roles (name, description) 
    VALUES 
        ('owner', 'owner of the project'), 
        ('admin', 'user with all permissions'), 
        ('editor', 'user with permissions to create, edit and delete content')
    ON CONFLICT (name) DO NOTHING;
    `
