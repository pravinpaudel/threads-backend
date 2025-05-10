import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
// import { prismaClient } from './lib/db';

async function startServer() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());

    const server = new ApolloServer({
        typeDefs: `
                type Query {
                    hello: String
                }
                type Mutation {
                    createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
                }
                `,
        resolvers: {
            Query: {
                hello: () => 'Hello world!'
            },
            Mutation: {
                // createUser: async (_, { firstName, lastName, email, password }:
                //     { firstName: string; lastName: string; email: string; password: string }) => {
                //     await prismaClient.user.create({
                //         data: {
                //             firstName,
                //             lastName,
                //             email,
                //             password,
                //             salt: "random_salt"
                //         }
                //     })
                //     return true;
                // }
            }
        }
    });

    await server.start();

    app.use('/graphql', expressMiddleware(server));

    app.get('/', (req, res) => {
        res.json('Hello World!');
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error('Error starting server:', error);
});
