export default `
    INSERT INTO users (email, password_hash, role_id, email_verified, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, role_id, email_verified, status
`
