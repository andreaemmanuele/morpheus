import process from 'node:process'
import chalk from 'chalk'
import { remixFastify } from '@mcansh/remix-fastify'
import { fastify } from 'fastify'
import sourceMapSupport from 'source-map-support'
import getPort, { portNumbers } from 'get-port'
import { configDotenv } from 'dotenv'
import migrate from './plugins/migrate.js'
import rateLimit from './plugins/rate-limit.js'
import jwt from './plugins/jwt.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
/*import { authenticate, isAdmin } from './utils/auth.js'*/

configDotenv()
sourceMapSupport.install()

const app = fastify()

await app.register(remixFastify)
app.register(migrate)
app.register(jwt)
app.register(rateLimit)

app.register(authRoutes, { prefix: '/api' })
app.register(projectRoutes, { prefix: '/api' })

/*app.get(
  '/api/protected',
  {
    onRequest: [authenticate],
  },
  async (request) => {
    return { message: 'This is a protected route', user: request.user }
  }
)

app.get(
  '/api/admin/protected',
  {
    onRequest: [isAdmin],
  },
  async (request) => {
    return { message: 'This is a admin protected route', user: request.user }
  }
)*/

app.ready(async () => {
  try {
    await app.runMigrations()
  } catch (err) {
    app.log.error('Failed to initialize database tables:', err)
  }
})

const host = process.env.HOST === 'true' ? '0.0.0.0' : 'localhost'
const desiredPort = Number(process.env.PORT) || 3000
const portToUse = await getPort({
  port: portNumbers(desiredPort, desiredPort + 100),
})

let address = await app.listen({ port: portToUse, host })

if (portToUse !== desiredPort) {
  console.warn(
    chalk.yellow(
      `⚠️  Port ${desiredPort} is not available, using ${portToUse} instead.`
    )
  )
}

if (address.match(/http:\/\/\[::1\]/)) {
  address = address.replace(/http:\/\/\[::1\]/, 'http://localhost')
}

console.log(chalk.green(`App up and running at ${address}`))
