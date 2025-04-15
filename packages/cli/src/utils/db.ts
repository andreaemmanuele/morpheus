import postgres from 'postgres'
import { loadEnv } from '@/src/utils/env.js'

loadEnv()

const sql = postgres(process.env.POSTGRES_DB_URL as string)

export default {
  // eslint-disable-next-line
  query: (text: string, params: any) => sql.unsafe(text, params),
  end: () => sql.end(),
}
