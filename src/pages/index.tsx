import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import type { Machine } from '@prisma/client';
import { CldImage } from 'next-cloudinary';

import LockScreen from '@/components/LockScreen';

interface studentAllowedResponse {
    allowed: string;
    allowedMachines: Machine[];
}

const Index = (props) => {
    const [error, setError] = useState('');
    const [studentAllowed, setStudentAllowed] = useState<boolean>(false);
    const [allowedMachines, setAllowedMachines] = useState<Machine[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        const machineUUID = localStorage.getItem('machineUUID');
        const userId = session?.user?.id;
        if (!userId) return;
        if (!machineUUID) {
            // go to /admin/machine to set machine
            setError('Machine not set. Please contact an administrator.');
            return;
        }

        const setMachineUsage = async () => {
            await fetch(
                `/api/admin/machine/access?machineUUID=${machineUUID}&userId=${session?.user?.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.allowed === 'true') {
                        setStudentAllowed(true);
                    }
                    if (!data.allowedMachines) return;
                    setAllowedMachines(
                        data.allowedMachines.map((machineArray: any) => {
                            return {
                                id: machineArray.machine.id,
                                name: machineArray.machine.name
                            };
                        })
                    );
                })
                .catch((error) => {
                    setError(error);
                });
        };
        setMachineUsage();
    }, [session?.user?.id]);

    return (
        <div className="w-screen flex flex-col items-center justify-center text-green font-oxygen">
            {!session && <LockScreen />}
            {session && studentAllowed && (
                <div className="flex flex-row">
                    {session.user && session.user?.avatar && (
                        <CldImage
                            width="300"
                            height="300"
                            sizes="100vw"
                            src={session.user?.avatar}
                            rawTransformations={[
                                'c_crop,g_face/c_scale,w_200,h_200/r_max/e_grayscale/f_auto'
                            ]}
                            alt="pfp"
                        />
                    )}
                    <div className="w-[50rem] ml-[10rem] text-center text-6xl capitalize">
                        {session.user?.firstName + ' ' + session.user?.lastName}
                    </div>
                </div>
            )}
            {session && !studentAllowed && (
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-6xl">
                        You are not allowed to use this machine.
                    </div>
                    {allowedMachines && (
                        <div className="mt-[2rem] mb-[1rem] text-4xl">
                            Machines you are allowed to use:
                            {allowedMachines.length === 0 && (
                                <div className="text-red">
                                    You are not allowed to use any machines.
                                </div>
                            )}
                            <div className="flex flex-col space-y-[1rem]">
                                {allowedMachines.map((machine) => (
                                    <div key={machine.id}>{machine.name}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {error && (
                <div className="mt-[4rem] text-center text-red text-4xl">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Index;
