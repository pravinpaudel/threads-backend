import { ApolloServer } from '@apollo/server';
import { prismaClient } from '../lib/db';
import { User } from './user/user';

async function createApolloGraphqlServer() {
    const server = new ApolloServer({
        typeDefs: `
                    type Query {
                        hello: String
                    }
                    type Mutation {
                        ${User.mutations}
                    }
                    `,
        resolvers: {
            Query: { 
                ...User.resolvers.queries
            },
            Mutation: {
                 ...User.resolvers.queries
            }
        }

    });

    await server.start();

    return server;
}

export default createApolloGraphqlServer;