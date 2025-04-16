type PostgresError = {
  code: string
  message: string
  severity_local: string
  severity: string
  detail: string
  schema_name: string
  table_name: string
  constraint_name: string
  file: string
  line: string
  routine: string
}

export const handleError = (error: unknown) => {
  const e = error as PostgresError
  const errorCodes = {
    ECONNREFUSED: 'Failed to connect to the database',
    '23505': `Record already exists in ${e.table_name} table`,
  }
  const _e = errorCodes[e.code as keyof typeof errorCodes]
  console.error(_e ? _e : e)
}
