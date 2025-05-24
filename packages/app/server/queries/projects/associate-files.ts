export default `
    INSERT INTO projects_files (project_id, file_id, category)
    SELECT
        unnest($1::integer[]) as project_id,
        unnest($2::integer[]) as file_id,
        $3
`
