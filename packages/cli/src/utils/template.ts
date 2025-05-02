import fs from 'fs'
import path from 'path'
import readline from 'readline'
import chalk from 'chalk'

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

export const prompt = (question: string) =>
  new Promise((resolve) => {
    rl.question(question, resolve)
  })

export const createEnvFile = async (
  appDir: string,
  newValues: Record<string, string>
) => {
  try {
    const envExamplePath = `${appDir}/.env.example`

    if (!fs.existsSync(envExamplePath)) {
      throw new Error(`${envExamplePath} not found`)
    }

    const fileContent = await fs.promises.readFile(envExamplePath, 'utf8')
    const lines = fileContent.split('\n')

    const updatedLines = lines.map((line) => {
      if (line.trim().startsWith('#') || line.trim() === '') return line

      const equalsIndex = line.indexOf('=')
      if (equalsIndex === -1) return line

      const key = line.substring(0, equalsIndex).trim()

      if (Object.prototype.hasOwnProperty.call(newValues, key)) {
        const updatedValue = newValues[key]
        return `${key}=${updatedValue}`
      }

      return line
    })

    const updatedContent = updatedLines.join('\n')

    await fs.promises.writeFile(`${appDir}/.env`, updatedContent, 'utf8')

    console.log(chalk.green('Successfully created .env'))
  } catch (e) {
    const error = e as Error
    console.error(`Error updating env file: ${error.message}`)
    throw error
  }
}

export const copyDirectoryRecursive = async (
  source: string,
  destination: string
) => {
  await fs.promises.mkdir(destination, { recursive: true })
  const entries = await fs.promises.readdir(source, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name)
    const destPath = path.join(destination, entry.name)

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue
      await copyDirectoryRecursive(sourcePath, destPath)
    } else {
      await fs.promises.copyFile(sourcePath, destPath)
    }
  }
}
