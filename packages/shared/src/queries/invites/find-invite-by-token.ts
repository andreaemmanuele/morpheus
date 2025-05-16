export default `SELECT email, token, expires_at FROM invites WHERE token = $1 AND expires_at > NOW()`
