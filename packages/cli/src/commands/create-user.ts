import bcryptjs from 'bcryptjs'
import chalk from 'chalk'
import { z } from 'zod'
import { Command } from 'commander'
import { queries } from '@morpheus/shared/queries'
import { passwordSchema } from '@morpheus/shared/schemas'
import db from '@/src/utils/db'
import { handleError } from '@/src/utils/errors'

const createUserSchema = z.object({
  email: z.string(),
  psw: z.string(),
  role: z.enum(['user', 'editor', 'admin']).optional(),
})

export const createUser = new Command()
  .name('create:user')
  .description('Create a user')
  .option('--email <email>', 'Email to register')
  .option('--psw <password>', 'Password for user')
  .option('--role [role]', 'Role to assign to the user', 'user')
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

      const roles = {
        admin: { id: 1, type: 'admin user', permissions: 'all' },
        editor: { id: 2, type: 'editor user', permissions: 'editorial' },
        user: { id: 3, type: 'user', permissions: 'basic' },
      }

      const role = roles[data?.role || 'user']
      const passwordHash = await bcryptjs.hash(data?.psw, 10)
      await db.query(queries.user.createUser, [
        data?.email,
        passwordHash,
        role.id,
        true,
        'active',
      ])

      console.log(chalk.green(`🚀 Successfully created ${role.type}`))
    } catch (error) {
      handleError(error)
    } finally {
      db.end()
    }
  })
