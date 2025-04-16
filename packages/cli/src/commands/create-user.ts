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

      const roles = {
        admin: { id: 1, type: 'admin user', permissions: 'all' },
        user: { id: 2, type: 'user', permissions: 'basic' },
      }

      const role = roles[data?.role || 'user']
      const passwordHash = await bcryptjs.hash(data?.psw, 10)
      await db.query(queries.auth.createUser, [
        data?.email,
        passwordHash,
        role.id,
        true,
        'active',
      ])

      console.log(`Successfully created ${role.type}`)
    } catch (error) {
      handleError(error)
    } finally {
      db.end()
    }
  })
