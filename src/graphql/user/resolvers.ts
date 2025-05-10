import { UserService, CreateUserPayload, GetUserTokenPayload } from "../../service/userService";

const queries = {
    getUserToken: async (_ : any, payload: GetUserTokenPayload) => {
        const token = await UserService.getUserToken(payload);
        if(!token) {
            throw new Error("User token generation failed");
        }
        console.log("User token generated successfully");
        return token;
    }
};

const mutations = { 
    createUser: async (_: any, payload: CreateUserPayload) => {
        const response = await UserService.createUser(payload);
        if (!response) {
            throw new Error("User creation failed");
        }
        console.log("User created successfully");
        return response.id;
    },

}

export const resolvers = { queries, mutations };