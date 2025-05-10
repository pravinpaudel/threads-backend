const queries = {};

const mutations = { 
    createUser: async (_: any, {}: {}) => {
        return "Hello User";
    }
}

export const resolvers = { queries, mutations };