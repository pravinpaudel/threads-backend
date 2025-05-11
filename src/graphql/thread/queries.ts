export const queries = ` #graphql
    getThread(threadId: ID!): Thread
    getUserThreads: [Thread]
    `;