export default `SELECT email FROM invites WHERE email = ANY($1)`
