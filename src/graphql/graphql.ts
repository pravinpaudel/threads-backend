import { ApolloServer } from '@apollo/server';
import { User } from './user/user';
import { Thread } from './thread/thread';

async function createApolloGraphqlServer() {
    const server = new ApolloServer({
        typeDefs: ` 
                    ${Thread.typeDefs}
                    ${User.typeDefs}
                    type Query {
                        ${User.queries}
                        ${Thread.queries}
                    }
                    type Mutation {
                        ${User.mutations}
                        ${Thread.mutations}
                    }
                    `,
        resolvers: {
            Query: { 
                ...User.resolvers.queries, 
                ...Thread.resolvers.queries
            },
            Mutation: {
                 ...User.resolvers.mutations,
                 ...Thread.resolvers.mutations
            }
        }

    });

    await server.start();

    return server;
}

export default createApolloGraphqlServer;