import { useState, useEffect, useContext } from 'react';
// import { motion } from 'framer-motion';
import Link from 'next/link';

import { useSession, signIn } from 'next-auth/react';
import type { Machine } from '@prisma/client';

import { MachineContext } from '@/lib/contexts/MachineContext';
import { AuthContext } from '@/lib/contexts/AuthContext';

import LockScreen from '@/components/LockScreen';
import ListStudents from '@/components/ListStudents';
import StarRating from '@/components/StarRating';
import FormattedTime from '@/components/FormattedTime';
import DynamicStarRating from '@/components/DynamicStarRating';
import SessionStopWatch from '@/components/SessionStopWatch';
import ApprenticeView from '@/components/ApprenticeView';
import CldAvatar from '@/components/CldAvatar';

interface AccessMachineType {
    allowed: boolean;
    apprentice?: boolean;
    allowedMachines?: Machine[];
    userMachineId?: number;
    averageRating?: number;
    lastUserLoginId?: number;
}

interface AccessMachineStatsType {
    userMachineSessions?: number;
    userMachineDuration?: number;
    userLifetimeSessions?: number;
    userLifetimeDuration?: number;
}

const Index = (props) => {
    const [error, setError] = useState('');
    const [accessMachine, setAccessMachine] = useState<AccessMachineType>({
        allowed: false,
        lastUserLoginId: -1
    });
    const [accessMachineStats, setAccessMachineStats] =
        useState<AccessMachineStatsType>({});
    const [wasCalled, setWasCalled] = useState(false);
    const [UILoading, setUILoading] = useState(true);

    const { data: nextAuthSession, update, status } = useSession();

    const { machineUUID } = useContext(MachineContext);
    const { runningSession } = useContext(AuthContext);

    const handleStarRatingClick = async () => {
        setAccessMachine((prevAccessMachine) => ({
            ...prevAccessMachine,
            lastUserLoginId: 0
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
            setUILoading(false);
            setError('Machine not set. Please contact your teacher.');
            return;
        }

        const setMachineUsage = async () => {
            await fetch(
                `/api/machine/checkAccess?machineUUID=${machineUUID}&userId=${userId}&isFirstLogin=${isFirstLogin}`,
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
                            averageRating: data.averageRating,
                            lastUserLoginId:
                                data.lastUserLoginId === null
                                    ? -1
                                    : data.lastUserLoginId
                        });
                        setAccessMachineStats({
                            userMachineSessions: data.userMachineSessions,
                            userMachineDuration: data.userMachineDuration,
                            userLifetimeSessions: data.userLifetimeSessions,
                            userLifetimeDuration: data.userLifetimeDuration
                        });
                    }
                    setUILoading(false);

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

    useEffect(() => {
        if (UILoading) return;
        if (accessMachine.allowed) return;
        const timeRemaining =
            nextAuthSession?.user.realExpTime - Math.floor(Date.now() / 1000);
        if (timeRemaining < 60) return;
        if (
            nextAuthSession?.user.role === 'ADMIN' ||
            nextAuthSession?.user.role === 'TEACHER'
        )
            return;
        update({
            realExpTime: Date.now() / 1000 + 59 // 1 minute
        });
    }, [
        UILoading,
        nextAuthSession?.user?.realExpTime,
        accessMachine.allowed,
        nextAuthSession?.user.role,
        update
    ]);

    return (
        <div className="flex w-screen flex-col items-center justify-center font-oxygen tracking-[.3rem] text-white">
            {!nextAuthSession && (
                <>
                    <LockScreen
                        placeholder="Enter your Student ID"
                        handleSubmit={handleSubmit}
                    />
                    {machineUUID ? (
                        <div className="mt-[8rem] flex flex-col items-center justify-center text-primary md:mt-[10rem]">
                            <div className="mb-[5rem] text-8xl md:text-6xl">
                                Last used:
                            </div>
                            <ListStudents
                                fetchUrl={`/api/machine/checkLastLogin?machineUUID=${machineUUID}&length=3`}
                                admin={false}
                            />
                        </div>
                    ) : (
                        <div className="mt-[8rem] text-6xl text-red">
                            Machine not set. Please contact your teacher.
                        </div>
                    )}
                </>
            )}

            {nextAuthSession &&
                accessMachine.allowed &&
                nextAuthSession?.user?.generalSafetyTest && (
                    <div className="flex flex-col text-center">
                        <div className="flex flex-row text-5xl">
                            <div className="flex flex-col space-x-[2rem]">
                                {nextAuthSession.user &&
                                    nextAuthSession.user?.avatar &&
                                    nextAuthSession?.user?.level && (
                                        <CldAvatar
                                            avatar={nextAuthSession.user.avatar}
                                            level={nextAuthSession.user.level}
                                            size={'extraLarge'}
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
                            <div className="ml-[10rem] flex flex-col space-y-[3rem] text-start text-secondary">
                                <div className="w-[50rem] text-6xl capitalize">
                                    {nextAuthSession.user?.firstName +
                                        ' ' +
                                        nextAuthSession.user?.lastName}
                                </div>
                                <div className="space-y-[2rem] text-5xl">
                                    {accessMachineStats.userMachineDuration !==
                                        undefined &&
                                        accessMachineStats.userMachineSessions !==
                                            undefined && (
                                            <div>
                                                <span>{`This machine: `}</span>
                                                <FormattedTime
                                                    milliseconds={
                                                        accessMachineStats.userMachineDuration
                                                    }
                                                    extraStyles="text-primary"
                                                />
                                                <span>
                                                    {` across `}
                                                    <span className="text-primary">
                                                        {
                                                            accessMachineStats.userMachineSessions
                                                        }
                                                    </span>
                                                    {` sessions`}
                                                </span>
                                            </div>
                                        )}

                                    {accessMachineStats.userLifetimeDuration !==
                                        undefined &&
                                        accessMachineStats.userLifetimeSessions !==
                                            undefined && (
                                            <div>
                                                <span>{`Lifetime: `}</span>
                                                <FormattedTime
                                                    milliseconds={
                                                        accessMachineStats.userLifetimeDuration
                                                    }
                                                    extraStyles="text-primary"
                                                />
                                                <span>
                                                    {` across `}
                                                    <span className="text-primary">
                                                        {
                                                            accessMachineStats.userLifetimeSessions
                                                        }
                                                    </span>
                                                    {` sessions`}
                                                </span>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-[10rem]">
                            {accessMachine.lastUserLoginId &&
                            accessMachine.lastUserLoginId > -1 ? (
                                <div className="text-5xl">
                                    <StarRating
                                        userLoginId={
                                            accessMachine.lastUserLoginId
                                        }
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
                                            updateUserMachineStats={(
                                                userMachineDuration,
                                                userMachineSessions,
                                                userLifetimeDuration,
                                                userLifetimeSessions
                                            ) =>
                                                setAccessMachineStats({
                                                    userMachineDuration,
                                                    userMachineSessions,
                                                    userLifetimeDuration,
                                                    userLifetimeSessions
                                                })
                                            }
                                            setError={setError}
                                        />
                                        {runningSession && <ApprenticeView />}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

            {UILoading &&
                (status == 'loading' || status == 'authenticated') && (
                    <div className="text-6xl">Loading...</div>
                )}

            {nextAuthSession &&
                !accessMachine.allowed &&
                nextAuthSession?.user?.generalSafetyTest && (
                    <div className="flex flex-col items-center justify-center text-center">
                        {!UILoading && machineUUID && (
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-[100rem] text-6xl">
                                    You are{' '}
                                    {`${
                                        accessMachine.apprentice
                                            ? 'an apprentice on this machine. Please wait for a mentor to start your session.'
                                            : 'not authorized to use this machine'
                                    }`}
                                </div>
                                {!accessMachine.apprentice && (
                                    <div className="mt-[5rem] w-[50rem] p-[2rem] text-4xl outline outline-4 ">
                                        <Link href={'/student/safetyTest'}>
                                            Take Machine Safety Test
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {accessMachine.allowedMachines && (
                            <div className="mt-[10rem] text-5xl text-primary">
                                Machines you are authorized to use:
                                {accessMachine.allowedMachines.length === 0 && (
                                    <div className="mt-[3rem] text-red">
                                        You are not authorized to use any
                                        machines.
                                    </div>
                                )}
                                <div className="mt-[3rem] flex flex-col space-y-[1rem]">
                                    {accessMachine.allowedMachines.map(
                                        (machine) => (
                                            <div
                                                className="text-secondary"
                                                key={machine.id}
                                            >
                                                {machine.name}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            {nextAuthSession && !nextAuthSession?.user?.generalSafetyTest && (
                <div className="mt-[10rem] flex w-[130rem] flex-col items-center justify-center text-center text-6xl  text-red">
                    You have not taken the general safety test. Please take the
                    test before using any machines.
                    <div className="mt-[5rem] w-[50rem] p-[2rem] text-4xl outline outline-4 ">
                        <Link
                            href={{
                                pathname: '/student/safetyTest',
                                query: { generalSafetyTest: 'true' }
                            }}
                        >
                            Take General Safety Test
                        </Link>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-[4rem] text-center text-4xl text-red">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Index;
