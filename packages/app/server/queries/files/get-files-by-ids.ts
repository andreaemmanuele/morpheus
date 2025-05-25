export default `SELECT * FROM files WHERE id = ANY($1::integer[])`
