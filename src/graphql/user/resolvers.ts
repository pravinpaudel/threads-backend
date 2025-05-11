import { UserService, CreateUserPayload, GetUserTokenPayload } from "../../service/userService";

const queries = {
    getUserToken: async (_ : any, payload: GetUserTokenPayload) => {
        const token = await UserService.getUserToken(payload);
        if(!token) {
            throw new Error("User token generation failed");
        }
        console.log("User token generated successfully");
        return token;
    },

    // The 3rd argument is the context. The context is an object that contains information about the request. It can be used to pass data to the resolvers.
    // The context is created for every request. It can be used to pass data to the resolvers.
    getCurrentLoggedInUser: async (_: any, parameters : any, context: any) => {
        console.log("Context: ", context);
        const user = context.user;
        if(!user) {
            throw new Error("User not authenticated");
        }
        const userObj = await UserService.getUserById(user.id);
        if(!userObj) {
            throw new Error("User not found");
        }
        return userObj;
    }


};

const mutations = { 
    createUser: async (_: any, payload: CreateUserPayload) => {
        const response = await UserService.createUser(payload);
        if (!response) {
            throw new Error("User creation failed");
        }
        console.log("User created successfully");
        return UserService.getUserToken({email: payload.email, password: payload.password});
    },

}

export const resolvers = { queries, mutations };