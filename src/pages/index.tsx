import { useState, useEffect, useContext } from 'react';
// import { motion } from 'framer-motion';

import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import type { Machine } from '@prisma/client';

import { MachineContext } from '@/lib/contexts/MachineContext';

import LockScreen from '@/components/LockScreen';
import ListStudents from '@/components/ListStudents';
import StarRating from '@/components/StarRating';
import DynamicStarRating from '@/components/DynamicStarRating';
import SessionStopWatch from '@/components/SessionStopWatch';
import ApprenticeView from '@/components/ApprenticeView';
import { CustomToast } from '@/components/ApprenticeView';
import CldAvatar from '@/components/CldAvatar';

interface AccessMachine {
    allowed: boolean;
    apprentice?: boolean;
    allowedMachines?: Machine[];
    userMachineId?: number;
    averageRating?: number;
    lastLoginId?: number;
}

interface FormattedTimeProps {
    prependedString?: string;
    milliseconds: number;
}
// returns a string in the format of "HH:MM:SS". If seconds, minutes, or hours are less than 10, a 0 is prepended to the string.
export const FormattedTime = ({
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
            {(prependedString ? prependedString : '') +
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
    const { machineUUID } = useContext(MachineContext);

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
                        ),
                        apprentice: data.apprentice
                    });
                })
                .catch((error) => {
                    setError(error);
                });
        };
        setMachineUsage();
        setWasCalled(true);
    }, [nextAuthSession?.user?.id, nextAuthSession?.user?.isFirstLogin]);

    const handleSubmit = async (
        studentId: string,
        setStudentId: any,
        setError: any
    ) => {
        const parsedStudentId = parseInt(studentId);

        if (!isNaN(parsedStudentId)) {
            await signIn('credentials', {
                studentId: parsedStudentId
                // redirect: false
            }).then((res) => {
                if (res && res.error) {
                    setError('Error signing in, please try again');
                    setStudentId('');
                }
            });
        }
    };

    return (
        <div className="flex w-screen flex-col items-center justify-center font-oxygen tracking-[.3rem] text-white">
            {!nextAuthSession && (
                <>
                    <LockScreen
                        placeholder="Enter your Student ID"
                        handleSubmit={handleSubmit}
                    />
                    {machineUUID && (
                        <div className="mt-[5rem] flex flex-col items-center justify-center text-blue-300">
                            <div className="mb-[2rem] text-5xl">Last used:</div>
                            <ListStudents
                                fetchUrl={`/api/checkLastLogin?machineUUID=${machineUUID}&length=3`}
                                admin={false}
                            />
                        </div>
                    )}
                </>
            )}
            {nextAuthSession && accessMachine.allowed && (
                <div className="flex flex-col text-center">
                    <div className="flex flex-row text-5xl">
                        <div className="flex flex-col space-x-[2rem]">
                            {nextAuthSession.user &&
                                nextAuthSession.user?.avatar &&
                                nextAuthSession?.user?.level && (
                                    <CldAvatar
                                        avatar={nextAuthSession.user.avatar}
                                        level={nextAuthSession.user.level}
                                        size={'LARGE'}
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
                        <div className="text-fhs-yellow ml-[10rem] flex flex-col space-y-[3rem] text-start">
                            <div className="w-[50rem] text-6xl capitalize">
                                {nextAuthSession.user?.firstName +
                                    ' ' +
                                    nextAuthSession.user?.lastName}
                            </div>
                            <div className="space-y-[2rem] text-5xl">
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
                                <div className="flex flex-col">
                                    <SessionStopWatch
                                        userId={nextAuthSession.user?.id}
                                        userMachineId={
                                            accessMachine?.userMachineId
                                        }
                                        setUserMachineDuration={
                                            setUserMachineDuration
                                        }
                                        setUserLifetimeDuration={
                                            setUserLifetimeDuration
                                        }
                                        setError={setError}
                                    />
                                    <ApprenticeView />
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {nextAuthSession && !accessMachine.allowed && (
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-6xl">
                        You are{' '}
                        {`${
                            accessMachine.apprentice
                                ? 'an apprentice on this machine. Please wait for a mentor to start your session.'
                                : 'not allowed to use this machine'
                        }`}
                    </div>
                    {accessMachine.allowedMachines && (
                        <div className="mb-[1rem] mt-[2rem] text-4xl">
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
                <div className="mt-[4rem] text-center text-4xl text-red">
                    <CustomToast text={error} />
                </div>
            )}
        </div>
    );
};

export default Index;
