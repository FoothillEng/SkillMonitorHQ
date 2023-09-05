import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            studentId: number;
            firstName: string;
            lastName: string;
            avatar: string;
            admin: boolean;
        } & Session['user'];
    }
}
