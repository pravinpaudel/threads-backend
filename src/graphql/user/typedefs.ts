export const typeDefs = `#graphql 
    type User {
        id: ID!
        firstName: String!
        lastName: String
        email: String!
        profileImage: String
        threads: [Thread]
    }
`;