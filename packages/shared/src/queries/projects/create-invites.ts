export default `
    INSERT INTO invites (email, token, project_id)
    SELECT * FROM unnest($1::varchar[], $2::varchar[], $3::integer[])
    RETURNING id, email, project_id`
