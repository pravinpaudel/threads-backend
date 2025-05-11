export const typeDefs = ` #graphql
  type Thread {
      id: ID!
      content: String!
      user: User!
      createdAt: String
      updatedAt: String
      replies: [Thread]
      likesCount: Int
      isPublic: Boolean
      parentThreadId: ID
      parentThread: Thread
    }
    `;