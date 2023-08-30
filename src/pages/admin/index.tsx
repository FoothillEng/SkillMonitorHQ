import { GetServerSideProps } from 'next';

import { useAppStore, useStore } from '@/lib/store';

const adminIndex = (props) => {
    return (
        <div>
            <h1>Admin</h1>
        </div>
    );
};

export default adminIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
    // const session = await getSession(context);

    // if (!session) {
    //     return {
    //         redirect: {
    //             destination: '/login',
    //             permanent: false
    //         }
    //     };
    // }

    const student = useStore(useAppStore, (state) => state.student);

    // Check if the user has the admin flag enabled in your database
    const isAdmin = await checkIfUserIsAdmin(student.id);

    if (!isAdmin) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }

    return {
        props: {}
    };
};

async function checkIfUserIsAdmin(userId: string): Promise<boolean> {
    // Use Prisma to check if the user has the admin flag enabled
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            isAdmin: true
        }
    });

    return user?.isAdmin ?? false;
}
