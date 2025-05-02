import chalk from 'chalk'
import { Command } from 'commander'
import readline from 'readline'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const prompt = (question: string) =>
  new Promise((resolve) => {
    rl.question(question, resolve)
  })

function copyDirectoryRecursive(source: string, destination: string) {
  fs.mkdirSync(destination, { recursive: true })
  const entries = fs.readdirSync(source, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name)
    const destPath = path.join(destination, entry.name)

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue
      copyDirectoryRecursive(sourcePath, destPath)
    } else {
      fs.copyFileSync(sourcePath, destPath)
    }
  }
}

export const createApp = new Command()
  .name('create:app')
  .description('Create a new morpheus app')
  .requiredOption('--name <name>', 'Name of the app', 'my-morpheus-app')
  .action(async ({ name }: { name: string }) => {
    console.log(chalk.blue('📦 Creating a new morpheus app...'))

    const dbUser =
      (await prompt('Database username [postgres]: ')) || 'postgres'
    const dbPassword =
      (await prompt('Database password [postgres]: ')) || 'postgres'
    const dbName = (await prompt(`Database name ['app_db]: `)) || `app_db`
    const dbPort = (await prompt('Database port [5432]: ')) || '5432'

    const fullPath = path.resolve(process.cwd(), name)

    if (fs.existsSync(fullPath)) {
      const overwrite = (await prompt(
        `Directory ${fullPath} already exists. Overwrite? (y/N): `
      )) as string

      if (overwrite.toLowerCase() !== 'y') {
        console.log(chalk.red('❌ Operation cancelled'))
        rl.close()
        return
      }
    }

    try {
      fs.mkdirSync(fullPath, { recursive: true })
      const templateDir = path.resolve(__dirname, '../src/template')
      copyDirectoryRecursive(templateDir, fullPath)

      const envContent = `POSTGRES_USER=${dbUser}\nPOSTGRES_PASSWORD=${dbPassword}\nPOSTGRES_DB=${dbName}\nDB_PORT=${dbPort}`

      fs.writeFileSync(path.join(fullPath, '.env'), envContent)

      const gitInit = (await prompt('Want to initialize git? (y/N)')) as string

      if (gitInit.toLowerCase() === 'y') {
        try {
          await new Promise((resolve, reject) => {
            exec(`git init ${name}`, (error, stdout) => {
              if (error) {
                reject(error)
                return
              }
              resolve(stdout)
            })
          })

          console.log(chalk.green('🚀 Git initialized'))
        } catch {
          console.log(chalk.red('Cannot initialize git'))
        }
      }

      console.log(chalk.green(`✅ App create successfully`))
      console.log(chalk.blue(`cd ${name}`))
      console.log(chalk.blue('pnpm install'))
    } catch {
      console.log(
        chalk.red(
          '❌ Something went wrong while creating app, operation cancelled'
        )
      )
    }

    rl.close()
  })
