import bcryptjs from 'bcryptjs'
import chalk from 'chalk'
import { z } from 'zod'
import { Command } from 'commander'
import { queries } from '@morphe.us/shared/queries'
import { passwordSchema } from '@morphe.us/shared/schemas'
import db from '@/src/utils/db'
import { handleError } from '@/src/utils/errors'

const createUserSchema = z.object({
  email: z.string(),
  username: z.string(),
  psw: z.string(),
})

export const createUser = new Command()
  .name('create:user')
  .description('Create a user')
  .option('--email <email>', 'Email to register')
  .option('--username <username>', 'Username to associate')
  .option('--psw <password>', 'Password for user')
  .action(async (options) => {
    try {
      const { data, error: createError } = createUserSchema.safeParse(options)
      if (createError) {
        console.error('Error:', createError.errors[0].message)
        return
      }

      const { error } = passwordSchema.safeParse({ password: data?.psw })
      if (error) {
        console.log(chalk.red(`‼️${error.errors[0].message}`))
        return
      }

      const passwordHash = await bcryptjs.hash(data?.psw, 10)
      await db.query(queries.user.createUser, [
        data?.email,
        data?.username,
        passwordHash,
        true,
        'active',
      ])

      console.log(chalk.green(`🚀 Successfully created user ${data?.username}`))
    } catch (error) {
      handleError(error)
    } finally {
      db.end()
    }
  })
