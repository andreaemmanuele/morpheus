import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const loadSqlFile = (filename: string) =>
  fs.readFileSync(join(__dirname, filename), 'utf8')

export const queries = {
  auth: {
    createUsersTable: loadSqlFile('./auth.sql'),
  },
}
