import fp from 'fastify-plugin'
import fastifyHttpProxy from '@fastify/http-proxy'

export default fp(async (fastify) => {
  if (process.env.IS_PRODUCTION) return
  fastify.register(fastifyHttpProxy, {
    upstream: 'localhost:5173',
    prefix: '/',
    rewritePrefix: '/',
  })
})
