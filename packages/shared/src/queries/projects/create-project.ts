export default `
    INSERT INTO projects (icon, name, slug)
    VALUES ($1, $2, $3)
    RETURNING id, icon, name, slug`
