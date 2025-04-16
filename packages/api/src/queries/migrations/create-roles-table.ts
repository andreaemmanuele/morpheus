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
        ('admin', 'user with all permissions'), 
        ('user', 'user with basic permissions')
    ON CONFLICT (name) DO NOTHING;
    `
