import postgres from 'postgres'

if (!process.env.POSTGRES_DB_URL) throw new Error('Missing POSTGRES_DB_URL')
const sql = postgres(process.env.POSTGRES_DB_URL as string)

export default {
  // eslint-disable-next-line
  query: (text: string, params: any) => sql.unsafe(text, params),
  end: () => sql.end(),
}
