import fs from 'fs'
import crypto from 'crypto'
import chalk from 'chalk'
import path, { dirname } from 'path'
import { exec } from 'child_process'
import { Command } from 'commander'
import { fileURLToPath } from 'url'
import {
  rl,
  prompt,
  copyDirectoryRecursive,
  createEnvFile,
} from '@/src/utils/template.js'

export const createApp = new Command()
  .name('create:app')
  .description('Create a new morpheus app')
  .requiredOption('--name <name>', 'Name of the app', 'my-morpheus-app')
  .action(async ({ name }: { name: string }) => {
    console.log(chalk.blue('📦 Creating a new morpheus app...'))

    const dbHost =
      (await prompt('Database username [localhost]: ')) || 'localhost'
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

      const __filename = fileURLToPath(import.meta.url)
      const __dirname = dirname(__filename)
      const templateDir = path.resolve(__dirname, '../src/template')

      await copyDirectoryRecursive(templateDir, fullPath)
      await createEnvFile(fullPath, {
        POSTGRES_DB_URL: `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
        JWT_SECRET: crypto.randomBytes(40).toString('hex'),
        COOKIE_SECRET_KEY: crypto.randomBytes(40).toString('hex'),
      })

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
    } catch (e) {
      console.error(e)
      console.log(
        chalk.red(
          '❌ Something went wrong while creating app, operation cancelled'
        )
      )
    }

    rl.close()
  })
