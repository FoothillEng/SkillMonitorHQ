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
                // const { studentId } = loginUserSchema.parse(credentials);
                const studentId = parseInt(credentials?.studentId as string);
                console.log(studentId);
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
            session.user.admin = token.admin;
            return session;
        },
        jwt({ token, account, user }) {
            if (account) {
                token.id = user.id;
                token.studentId = (user as User).studentId;
                token.firstName = (user as User).firstName;
                token.lastName = (user as User).lastName;
                token.avatar = (user as User).avatar;
                token.admin = (user as User).admin;
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
    pages: {
        signIn: '/',
        signOut: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt", maxAge: 15 * 60 }, // 15 minutes


    jwt: {
        secret: process.env.NEXTAUTH_SECRET
    },
};

export default NextAuth(authOptions);
