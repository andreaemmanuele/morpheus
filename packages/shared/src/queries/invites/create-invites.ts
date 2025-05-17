export default `
    INSERT INTO invites (email, token, user_id, project_id)
    SELECT * FROM unnest($1::varchar[], $2::varchar[], $3::integer[], $4::integer[])
    RETURNING id, email, user_id`
