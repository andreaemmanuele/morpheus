export default `SELECT * FROM refresh_tokens WHERE user_id = $1 AND expires_at > NOW() AND revoked = false`
