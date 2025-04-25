import fp from 'fastify-plugin'
import fastifyRateLimit from '@fastify/rate-limit'
export default fp(async (fastify) => {
  if (process.env.DISALLOW_RATE_LIMIT) return
  fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })
})
