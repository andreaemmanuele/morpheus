import postgres from '@fastify/postgres';
import fastify from 'fastify';
export const connect = async () => {
    const fs = fastify();
    await fs.register(postgres, {
        connectionString: process.env.POSTGRES_DB_URL,
    });
    const client = await fs.pg.connect();
    return { client };
};
export const executeQuery = async (query, values) => {
    const { client } = await connect();
    return client.query(query, values);
};
