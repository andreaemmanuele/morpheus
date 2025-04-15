import { readFileSync } from 'fs'
import { resolve } from 'path'

export const loadEnv = (path = '../../.env') => {
  try {
    const envPath = resolve(process.cwd(), path)
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
