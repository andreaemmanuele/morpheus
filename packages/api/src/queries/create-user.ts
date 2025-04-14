export default `INSERT INTO users (email, password_hash, role)
VALUES ($1, $2, $3)
RETURNING id, email, role`
