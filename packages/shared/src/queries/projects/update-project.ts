export default `
    UPDATE projects
    SET
    icon = COALESCE($1, icon),
    name = COALESCE($2, name),
    slug = COALESCE($3, slug)
    WHERE id = $4;
`
