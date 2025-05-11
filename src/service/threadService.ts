import { prismaClient } from "../lib/db";

// The input from the client comes in the form of JSON. So we need to define the types of the input. 
export interface UpdateThreadPayload {
    threadId: string;
    content: string;
}

export class ThreadService {
    public static async getThreadsByUserId(id: string) {
        const threads = await prismaClient.thread.findMany({
            where: {
                userId: id
            },
            // Along with the thread, include the user data. It's posible without manually joining the tables beacause instead of only using user_id we used the whole user object in the thread model
            include: {
                user: true
            }
        })
        return threads;
    }

    public static async getThreadById({ threadId } : { threadId: string }) {
        if (!threadId) {
            throw new Error("ThreadId is required");
        }
        const thread = await prismaClient.thread.findUnique({
            where: {
                id: threadId
            },
            include: {
                user: true,
                replies: true,
                parentThread: true
            }
        })
        if (!thread) {
            throw new Error("Thread not found");
        }
        return thread;
    }

    public static async createThread({ content }: { content: string }, userId: string) {
        if (!content || !userId) {
            throw new Error("Content and userId are required");
        }
        const thread = await prismaClient.thread.create({
            data: {
                content: content,
                userId: userId
            },
            include: {
                user: true,
                parentThread: true,
            }
        })
        return thread;
    }

    public static async updateThread(payload: UpdateThreadPayload) {
        const { threadId, content } = payload;
        if (!threadId || !content) {
            throw new Error("ThreadId and content are required");
        }
        const thread = await prismaClient.thread.update({
            where: {
                id: threadId
            },
            data: {
                content: content
            },
            include: {
                user: true,
                replies: true
            }
        })
        return thread;
    }

    public static async deleteThread({ threadId }: {threadId: string}) {
        if (!threadId) {
            throw new Error("ThreadId is required");
        }
        // Check if the thread exists
        const thread = await prismaClient.thread.delete({
            where: {
                id: threadId
            },
            include: {
                user: true
            }
        })
        if (!thread) {
            throw new Error("Thread not found");
        }
        return thread;
    }

    public static async addReply({ parentThreadId, content } : { parentThreadId: string, content: string }, userId: string) {
        if (!parentThreadId || !content || !userId) {
            throw new Error("ParentThreadId, content and userId are required");
        }
        const thread = await prismaClient.thread.create({
            data: {
                content: content,
                userId: userId,
                parentThreadId: parentThreadId
            },
            include: {
                user: true,
                parentThread: true
            }
        })
        return thread;
    }

    public static async addLike({ threadId} : { threadId: string }, userId: string) {
        if (!threadId || !userId) {
            throw new Error("ThreadId and userId are required");
        }
    }
}
            
