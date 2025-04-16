import bcryptjs from 'bcryptjs'
import { Command } from 'commander'
import { z } from 'zod'
import { queries } from 'api/queries'
import db from '@/src/utils/db.js'
import { handleError } from '@/src/utils/errors.js'

const createUserSchema = z.object({
  email: z.string(),
  psw: z.string(),
  role: z.enum(['user', 'admin']).optional(),
})

export const createUser = new Command()
  .name('create:user')
  .description('Create a user')
  .option('--email <email>', 'Email to register')
  .option('--psw <password>', 'Password for user')
  .option('--role [role]', 'Role to assign to the user', 'user')
  .action(async (options) => {
    try {
      const { data, error } = createUserSchema.safeParse(options)

      if (error) {
        console.error('Error:', error.message)
        return
      }

      const passwordHash = await bcryptjs.hash(data?.psw, 10)
      await db.query(queries.auth.createUser, [
        data?.email,
        passwordHash,
        data?.role,
      ])

      console.log('Successfully created user')
    } catch (error) {
      handleError(error)
    } finally {
      db.end()
    }
  })
