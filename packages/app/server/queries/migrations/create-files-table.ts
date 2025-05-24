export default `
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    path TEXT NOT NULL,
    storage_adapter VARCHAR(50) NOT NULL,
    size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}',
    alt_text TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_files_id ON files(id);
CREATE INDEX IF NOT EXISTS idx_files_adapter ON files(storage_adapter);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(file_type);
`
