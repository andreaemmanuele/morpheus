import type { FastifyInstance } from 'fastify'

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/user/:id', (req, reply) => {
    const { id } = req.params as { id: string }
    /*fastify.pg.query(
            'SELECT id, username, hash, salt FROM users WHERE id=$1', [id],
            function onResult (err: FastifyError, result: any) {
                reply.send(err || result)
            }
        )*/
    reply.type('application/json').code(200).send({ id })
  })
}
