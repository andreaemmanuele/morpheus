export default `DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invite_status') THEN
                        CREATE TYPE invite_status AS ENUM ('pending', 'active', 'deleted');
                    END IF;
                END
                $$;`
