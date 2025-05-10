import { createHmac, randomBytes } from "node:crypto";
import { prismaClient } from "../lib/db";
import JWT from "jsonwebtoken";

export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}

export interface GetUserTokenPayload {
    email: string;
    password: string;
}

export class UserService {
    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = this.generateHash(password, salt);
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                salt: salt,
            }
        })
    }

    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({
            where: {
                email: email
            }
        })
    }

    private static generateHash(password: string, salt: string) {
        return createHmac("sha256", salt).update(password).digest("hex");
     }

    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;
        const user = await UserService.getUserByEmail(email);
        if(!user) {
            throw new Error("User not found");
        }
        const userSalt = user.salt;
        const hashedPassword = UserService.generateHash(password, userSalt);
        if (hashedPassword !== user.password) {
            throw new Error("Invalid password");
        }

        const token = JWT.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string);
        return token;
    }

}

