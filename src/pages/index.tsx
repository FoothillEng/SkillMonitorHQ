import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import type { Machine } from '@prisma/client';
import { CldImage } from 'next-cloudinary';

import LockScreen from '@/components/LockScreen';
import SessionStopWatch from '@/components/SessionStopWatch';

interface AccessMachine {
    allowed: boolean;
    allowedMachines?: Machine[];
    userMachineId?: number;
}

const Index = (props) => {
    const [error, setError] = useState('');
    const [accessMachine, setAccessMachine] = useState<AccessMachine>({
        allowed: false
    });
    const { data: nextAuthSession } = useSession();

    useEffect(() => {
        const machineUUID = localStorage.getItem('machineUUID');
        const userId = nextAuthSession?.user?.id;
        if (!userId) return;
        if (!machineUUID) {
            // go to /admin/machine to set machine
            setError('Machine not set. Please contact an administrator.');
            return;
        }

        const setMachineUsage = async () => {
            await fetch(
                `/api/admin/machine/access?machineUUID=${machineUUID}&userId=${nextAuthSession?.user?.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.allowed === true) {
                        setAccessMachine({
                            allowed: true,
                            userMachineId: data.userMachineId
                        });
                    }
                    if (!data.allowedMachines) return;
                    setAccessMachine({
                        allowed: false,
                        allowedMachines: data.allowedMachines.map(
                            (machineArray: any) => {
                                return {
                                    id: machineArray.machine.id,
                                    name: machineArray.machine.name
                                };
                            }
                        )
                    });
                })
                .catch((error) => {
                    setError(error);
                });
        };
        setMachineUsage();
    }, [nextAuthSession?.user?.id]);

    return (
        <div className="w-screen flex flex-col items-center justify-center text-green font-oxygen">
            {!nextAuthSession && <LockScreen />}
            {nextAuthSession && accessMachine.allowed && (
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        {nextAuthSession.user &&
                            nextAuthSession.user?.avatar && (
                                <CldImage
                                    width="300"
                                    height="300"
                                    sizes="100vw"
                                    src={nextAuthSession.user?.avatar}
                                    rawTransformations={[
                                        'c_crop,g_face/c_scale,w_200,h_200/r_max/e_grayscale/f_auto'
                                    ]}
                                    alt="pfp"
                                />
                            )}
                        <div className="w-[50rem] ml-[10rem] text-center text-6xl capitalize">
                            {nextAuthSession.user?.firstName +
                                ' ' +
                                nextAuthSession.user?.lastName}
                        </div>
                    </div>
                    <div>
                        {nextAuthSession && accessMachine.userMachineId && (
                            <SessionStopWatch
                                userId={nextAuthSession.user?.id}
                                userMachineId={accessMachine?.userMachineId}
                                setError={setError}
                            />
                        )}
                    </div>
                </div>
            )}

            {nextAuthSession && !accessMachine.allowed && (
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-6xl">
                        You are not allowed to use this machine.
                    </div>
                    {accessMachine.allowedMachines && (
                        <div className="mt-[2rem] mb-[1rem] text-4xl">
                            Machines you are allowed to use:
                            {accessMachine.allowedMachines.length === 0 && (
                                <div className="text-red">
                                    You are not allowed to use any machines.
                                </div>
                            )}
                            <div className="flex flex-col space-y-[1rem]">
                                {accessMachine.allowedMachines.map(
                                    (machine) => (
                                        <div key={machine.id}>
                                            {machine.name}
                                        </div>
                                    )
                                )}
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
