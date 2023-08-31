import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            studentId: number;
        } & Session['user'];
    }
}
