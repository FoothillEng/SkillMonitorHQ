import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { User } from '@prisma/client';
import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import { prisma } from '@/lib/prisma';

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                studentId: { label: 'Student Id', type: 'number', placeholder: 'Enter your student ID' },
            },
            async authorize(credentials, req) {
                const studentId = parseInt(credentials?.studentId as string);
                const user = await prisma.user.findUnique({
                    where: { studentId },
                });
                if (!user) return null;

                return user;
            },
        }),
    ],
    callbacks: {
        session({ session, token }) {
            session.user.id = token.id;
            session.user.studentId = token.studentId;
            session.user.firstName = token.firstName;
            session.user.lastName = token.lastName;
            session.user.avatar = token.avatar;
            session.user.role = token.role;
            session.user.level = token.level;
            session.user.isFirstLogin = token.isFirstLogin;
            session.user.message = token.message;
            session.user.realExpTime = token.realExpTime;
            return session;
        },
        jwt({ token, user, account, trigger, session }) {
            if (account?.provider === 'credentials') {
                token.id = (user as User).id;
                token.studentId = (user as User).studentId;
                token.firstName = (user as User).firstName;
                token.lastName = (user as User).lastName;
                token.avatar = (user as User).avatar;
                token.role = (user as User).role;
                token.level = (user as User).level;
            }

            if (trigger === 'signIn') {
                token.isFirstLogin = true;
            } else if (trigger === "update" && session?.realExpTime) {
                token.realExpTime = session.realExpTime;
                // session.user.timeRemaining = session.user.realExpTime - Math.floor(Date.now() / 1000);
                // session.user.realExpTime = token.realExpTime;
            } else {
                if (token.iat) {
                    if (token.realExpTime === undefined) {  // first time login??
                        token.realExpTime = token.iat as number + 1800;  // 30 minutes
                    }

                }

                if (!(token.isFirstLogin === false)) {
                    const indexPageHasLoaded = session?.message === "ab247ac550e244a1f71147fb444a4ef101cc49bd32edb912ea35076b15e147de"; // just means page is loaded
                    if (indexPageHasLoaded) {
                        token.isFirstLogin = false;
                    }
                }
            }

            return token;

        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin - Disabled for now since there is no use case
            // else if (new URL(url).origin === baseUrl) {
            //     const callbackUrl = new URL(url).searchParams.get("callbackUrl")

            //     if (callbackUrl) {
            //         return callbackUrl
            //     }
            //     return url
            // }
            return baseUrl
        }
    },
    pages: {
        signIn: '/',
        signOut: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 60 minutes =  15 * 60 , current is 30 days.


    jwt: {
        secret: process.env.NEXTAUTH_SECRET
    },
};

export default NextAuth(authOptions);
