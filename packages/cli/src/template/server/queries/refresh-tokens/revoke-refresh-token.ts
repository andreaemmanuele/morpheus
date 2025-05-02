export default `UPDATE refresh_tokens SET revoked = true WHERE token = $1`
