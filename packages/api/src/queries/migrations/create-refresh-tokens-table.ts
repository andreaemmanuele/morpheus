export default `
    CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        revoked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_indexes WHERE indexname = 'refresh_tokens_token_idx'
            ) THEN
                CREATE INDEX refresh_tokens_token_idx ON refresh_tokens(token);
            END IF;

            IF NOT EXISTS (
                SELECT 1 FROM pg_indexes WHERE indexname = 'refresh_tokens_user_id_idx'
            ) THEN
                CREATE INDEX refresh_tokens_user_id_idx ON refresh_tokens(user_id);
            END IF;
        END
    $$;`
