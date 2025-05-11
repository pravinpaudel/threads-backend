import { ThreadService, UpdateThreadPayload } from "../../service/threadService";

const queries = {
    getUserThreads: async (_: any, parameters: any, context: any) => {
        const user = context.user;
        if (!user) {
            throw new Error("User not authenticated");
        }
        const userId = user.id;
        const threads = await ThreadService.getThreadsByUserId(userId);
        return threads;
    },

    getThread: async (_: any, payload: any) => {
        return await ThreadService.getThreadById(payload);
    }
}

const mutations = {
    createThread: async (_: any, payload: any, context: any) => {
        const user = context.user;
        if (!user) {
            throw new Error("User not authenticated");
        }
        const userId = user.id;
        const thread = await ThreadService.createThread(payload, userId);
        if (!thread) {
            throw new Error("Thread creation failed");
        }
        return thread;
    },
    updateThread: async (_: any, payload: UpdateThreadPayload, context: any) => {
        const user = context.user;;
        if (!user)
            throw new Error("User not authenticated");
        const thread = await ThreadService.updateThread(payload);
        return thread;
    },
    deleteThread: async (_ : any, payload: any, context: any) => {
        const user = context.user;;
        if (!user)
            throw new Error("User not authenticated");
        const thread = await ThreadService.deleteThread(payload);
        return thread;
    },
    addReply: async (_: any, payload: any, context: any) => {
        const user = context.user;
        if (!user)
            throw new Error("User's not authenticated");
        const thread = await ThreadService.addReply(payload, user.id);
        return thread;
    }
}

export const resolvers = { queries, mutations }