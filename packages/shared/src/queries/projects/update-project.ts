export default `
    UPDATE projects
    SET
    icon = COALESCE($1, icon),
    name = COALESCE($2, name)
    WHERE id = $3;
`
