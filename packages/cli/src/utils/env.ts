import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

export const loadEnv = (path = '../../../.env') => {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    const envPath = resolve(__dirname, path)
    const content = readFileSync(envPath, 'utf8')

    content.split('\n').forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        const value = valueParts.join('=').trim()
        process.env[key.trim()] = value.replace(/^["'](.*)["']$/, '$1')
      }
    })
  } catch (error) {
    console.error(error)
  }
}
