import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { database } from "@/database";
import * as schema from "@/database/schema";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID || "",
            clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
        },
    },
    database: drizzleAdapter(database, {
        provider: "pg",
        schema,
    }),
    plugins: [nextCookies()],
});
