export default `
    INSERT INTO invites (email, project_id)
    SELECT * FROM unnest($1::varchar[], $2::integer[])
    RETURNING id, email, status, project_id`
