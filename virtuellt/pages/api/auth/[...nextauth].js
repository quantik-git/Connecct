import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

export default NextAuth({
    pages: {
        signIn: "/",
        error: "/",
        signOut: "/",
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const prisma = new PrismaClient();
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user) {
                    throw new Error("Password or Email doesn't match");
                }

                const match = await compare(credentials.password, user.password);
                // const match = credentials.password === user.password;
                if (match) {
                    return {
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        },
                    };
                } else {
                    throw new Error("Password or Email doesn't match");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, user, token }) {
            return token;
        },
    },
});
