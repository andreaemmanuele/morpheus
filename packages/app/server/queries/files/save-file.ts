export default `
INSERT INTO files (filename, original_name, mime_type, file_type, size, path, storage_adapter, metadata, alt_text) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE('', $9))
RETURNING *`
