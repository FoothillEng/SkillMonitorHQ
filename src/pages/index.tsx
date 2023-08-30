// import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAppStore, useStore } from '@/lib/store';

import LockScreen from '@/components/LockScreen';

const Index = (props) => {
    const student = useStore(useAppStore, (state) => state.student);

    return (
        <div className="w-screen flex items-center justify-center">
            {student && student.id === 0 ? (
                <LockScreen />
            ) : (
                <div className="text-center font-oxygen text-green">
                    <h1 className="text-6xl">Welcome to SkillMonitorHQ</h1>
                    <h2 className="text-3xl mt-4">
                        You are logged in as {student?.id}
                    </h2>
                    {student?.avatar &&
                        // <Image
                        //     src={`data:image/jpeg;base64,${student.avatar.toString(
                        //         'base64'
                        //     )}`}
                        //     alt="Avatar"
                        //     width={200}
                        //     height={200}
                        //     className="rounded-full mt-4"
                        // />

                        student?.avatar.toString('utf8')}
                </div>
            )}
        </div>
    );
};

export default Index;
