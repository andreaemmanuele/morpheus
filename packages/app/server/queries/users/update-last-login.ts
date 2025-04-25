export default `UPDATE users SET last_login = NOW(), login_attempts = 0 WHERE id = $1`
