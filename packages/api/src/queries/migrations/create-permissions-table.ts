export default `
    CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENt_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENt_TIMESTAMP
    );`
