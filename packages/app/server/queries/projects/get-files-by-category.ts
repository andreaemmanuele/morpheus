export default `
    SELECT *, COUNT(*) OVER() as total_count
    FROM projects_files
    JOIN files ON projects_files.file_id = files.id
    WHERE project_id = $1 AND category = $2
    ORDER BY created_at DESC
    LIMIT $3 OFFSET $4
`
