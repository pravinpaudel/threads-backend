// Mutation for typedefs 

export const mutations = `#graphql 
    createThread(content: String!): Thread
    updateThread(threadId:ID!, content: String!): Thread
    deleteThread(threadId: ID!): Thread
    addReply(parentThreadId: ID!, content: String!): Thread
    addLike(threadId: ID!): Thread
    removeLike(threadId: ID!): Thread
    `;