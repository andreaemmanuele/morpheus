export default `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        username VARCHAR(60) UNIQUE,
        password_hash VARCHAR(60) NOT NULL,
        password_reset_token VARCHAR(100),
        password_reset_expires TIMESTAMP,
        role_id INTEGER references roles(id) NOT NULL,
        email_verified BOOLEAN NOT NULL DEFAULT false,
        status user_status DEFAULT 'pending',
        login_attempts INTEGER DEFAULT 0,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
    );`
