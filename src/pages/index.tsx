// import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import LockScreen from '@/components/LockScreen';

const Index = (props) => {
    const { data: session, status } = useSession();

    return (
        <div className="w-screen flex items-center justify-center">
            {!session && <LockScreen />}
            {session && (
                <div className="text-center font-oxygen text-green">
                    <h1 className="text-6xl">Welcome to SkillMonitorHQ</h1>
                    <h2 className="text-3xl mt-4">
                        You are logged in as {session.user?.id}
                    </h2>
                    <h2>Your student ID is {session.user?.studentId}</h2>
                    {/* {student?.avatar && 
                        // <Image
                        //     src={`data:image/jpeg;base64,${student.avatar.toString(
                        //         'base64'
                        //     )}`}
                        //     alt="Avatar"
                        //     width={200}
                        //     height={200}
                        //     className="rounded-full mt-4"
                        // />

                    // student?.avatar.toString('utf8') */}
                </div>
            )}
        </div>
    );
};

export default Index;
