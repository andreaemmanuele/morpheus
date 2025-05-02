import type { QueryResult } from 'pg'
import { app } from '../plugins/database.js'

export const executeQuery = async <T extends object>(
  query: string,
  values: unknown[]
) => {
  const client = await app?.pg.connect()
  if (!client) {
    throw new Error(
      'Db plugin must be registered before using client connection'
    )
  }
  try {
    return (await client.query(query, values)) as QueryResult<T>
  } finally {
    client.release()
  }
}
