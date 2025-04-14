/*import type { FastifyError, FastifyInstance } from 'fastify'

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/user', (req, reply) => {
    fastify.pg.query(
      `

        `,
      (err: FastifyError, result: any) => {
        if (err) {
          reply.code(err.statusCode ?? 500).send(err)
          return
        }
        reply.send(result)
      }
    )
    /!*reply.type('application/json').code(200).send({ id })*!/
  })
}*/
