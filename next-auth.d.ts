import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            studentId: number;
            firstName: string;
            lastName: string;
            avatar: string;
            role: string;
            level: number;
        } & Session['user'];
    }
}
