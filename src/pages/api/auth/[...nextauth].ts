import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { User } from '@prisma/client';
import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import { prisma } from '@/lib/prisma';

const authOptions: AuthOptions = {
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
            return session;
        },
        jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
                token.id = user.id;
                token.studentId = (user as User).studentId;
            }
            return token;
        },
    },
    pages: {
        signIn: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt", maxAge: 5 * 60 }, // 5 minutes


    jwt: {
        secret: process.env.NEXTAUTH_SECRET
    },
};

export default NextAuth(authOptions);
