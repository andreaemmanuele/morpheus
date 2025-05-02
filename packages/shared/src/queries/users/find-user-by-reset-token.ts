export default `SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()`
