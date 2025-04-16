import fp from 'fastify-plugin'
import { fastifyJwt } from '@fastify/jwt'

export default fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
    sign: {
      expiresIn: '15m',
    },
  })
})
