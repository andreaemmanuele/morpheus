import fp from 'fastify-plugin'
import fastifyCors from '@fastify/cors'
export default fp(async (fastify) => {
  fastify.register(fastifyCors, {
    origin: process.env.CORS_ALLOWED_ORIGIN?.split(',').map((origin) => origin),
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Custom-Header'],
    maxAge: 86400,
  })
})
