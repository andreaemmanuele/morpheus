export default `
    UPDATE projects
    SET
    icon = COALESCE($1, icon),
    picture = COALESCE($2, picture),
    name = COALESCE($3, name)
    WHERE id = $4;
`
