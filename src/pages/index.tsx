import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import type { Machine } from '@prisma/client';
import { CldImage } from 'next-cloudinary';

import LockScreen from '@/components/LockScreen';
import StarRating from '@/components/StarRating';
import DynamicStarRating from '@/components/DynamicStarRating';
import SessionStopWatch from '@/components/SessionStopWatch';

interface AccessMachine {
    allowed: boolean;
    allowedMachines?: Machine[];
    userMachineId?: number;
    averageRating?: number;
    lastLoginId?: number;
}

interface FormattedTimeProps {
    prependedString: string;
    milliseconds: number;
}
// returns a string in the format of "HH:MM:SS". If seconds, minutes, or hours are less than 10, a 0 is prepended to the string.
const FormattedTime = ({
    prependedString,
    milliseconds
}: FormattedTimeProps) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const formattedSeconds = seconds % 60;
    const formattedMinutes = minutes % 60;
    const formattedHours = hours % 60;

    return (
        <div>
            {prependedString +
                (formattedHours < 10 ? '0' : '') +
                formattedHours +
                ':' +
                (formattedMinutes < 10 ? '0' : '') +
                formattedMinutes +
                ':' +
                (formattedSeconds < 10 ? '0' : '') +
                formattedSeconds}
        </div>
    );
};

const Index = (props) => {
    const [error, setError] = useState('');
    const [accessMachine, setAccessMachine] = useState<AccessMachine>({
        allowed: false,
        lastLoginId: 0
    });
    const [userMachineDuration, setUserMachineDuration] = useState<number>(-1); // [milliseconds]
    const [userLifetimeDuration, setUserLifetimeDuration] =
        useState<number>(-1); // [milliseconds]
    const [wasCalled, setWasCalled] = useState(false);
    const { data: nextAuthSession, update } = useSession();

    const handleStarRatingClick = async () => {
        setAccessMachine((prevAccessMachine) => ({
            ...prevAccessMachine,
            lastLoginId: 0
        }));
    };

    useEffect(() => {
        if (!wasCalled) return;
        update({
            message:
                'ab247ac550e244a1f71147fb444a4ef101cc49bd32edb912ea35076b15e147de' // just means page is loaded
        });
        setWasCalled(false);
    }, [wasCalled, nextAuthSession?.user?.isFirstLogin, update]);

    useEffect(() => {
        const machineUUID = localStorage.getItem('machineUUID');
        const userId = nextAuthSession?.user?.id;
        const isFirstLogin = nextAuthSession?.user?.isFirstLogin;
        if (!userId) return;
        if (!machineUUID) {
            // go to /admin/machine to set machine
            setError('Machine not set. Please contact an administrator.');
            return;
        }

        const setMachineUsage = async () => {
            await fetch(
                `/api/admin/machine/access?machineUUID=${machineUUID}&userId=${userId}&isFirstLogin=${isFirstLogin}`,
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
                            userMachineId: data.userMachineId,
                            lastLoginId:
                                data.lastLoginId == null ? 0 : data.lastLoginId,
                            averageRating: data.averageRating
                        });
                        setUserMachineDuration(data.userMachineDuration);
                        setUserLifetimeDuration(data.userLifetimeDuration);
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
        setWasCalled(true);
    }, [nextAuthSession?.user?.id, nextAuthSession?.user?.isFirstLogin]);

    return (
        <div className="w-screen flex flex-col items-center justify-center text-green font-oxygen">
            {!nextAuthSession && <LockScreen />}
            {nextAuthSession && accessMachine.allowed && (
                <div className="flex flex-col text-center">
                    <div className="flex flex-row text-5xl">
                        <div className="flex flex-col space-x-[2rem]">
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
                            {accessMachine.averageRating && (
                                <div className="mt-[3rem]">
                                    <DynamicStarRating
                                        averageRating={
                                            accessMachine.averageRating
                                        }
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col ml-[10rem] text-start space-y-[3rem]">
                            <div className="w-[50rem] text-6xl capitalize">
                                {nextAuthSession.user?.firstName +
                                    ' ' +
                                    nextAuthSession.user?.lastName}
                            </div>
                            <div className="text-5xl space-y-[2rem]">
                                {userMachineDuration != -1 && (
                                    <FormattedTime
                                        prependedString="This Machine: "
                                        milliseconds={userMachineDuration}
                                    />
                                )}
                                {userLifetimeDuration != -1 && (
                                    <FormattedTime
                                        prependedString="All Machines: "
                                        milliseconds={userLifetimeDuration}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-[7rem]">
                        {accessMachine.lastLoginId &&
                        accessMachine.lastLoginId > 0 ? (
                            <div className="text-5xl">
                                <StarRating
                                    currentUserId={nextAuthSession.user?.id}
                                    userLoginId={accessMachine.lastLoginId}
                                    handleStarRatingClick={
                                        handleStarRatingClick
                                    }
                                    setError={setError}
                                />
                            </div>
                        ) : (
                            nextAuthSession &&
                            accessMachine.userMachineId && (
                                <SessionStopWatch
                                    userId={nextAuthSession.user?.id}
                                    userMachineId={accessMachine?.userMachineId}
                                    setUserMachineDuration={
                                        setUserMachineDuration
                                    }
                                    setUserLifetimeDuration={
                                        setUserLifetimeDuration
                                    }
                                    setError={setError}
                                />
                            )
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
