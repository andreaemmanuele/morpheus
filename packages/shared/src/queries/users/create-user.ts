export default `
    INSERT INTO users (email, username, password_hash, email_verified, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, username, email_verified, status
`
