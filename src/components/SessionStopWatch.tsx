import { useState, useCallback, useRef, useContext, useEffect } from 'react';

import type { Session } from '@prisma/client';
import { useSession } from 'next-auth/react';

import { ApprenticeContext } from '@/lib/contexts/ApprenticeContext';

import FormattedTime from '@/components/FormattedTime';

interface SessionStopWatchProps {
    userId: string;
    userMachineId: number;
    setUserMachineDuration: (duration: number) => void;
    setUserLifetimeDuration: (duration: number) => void;
    setError: (error: string) => void;
}

const SessionStopWatch = ({
    userId,
    userMachineId,
    setUserMachineDuration,
    setUserLifetimeDuration,
    setError
}: SessionStopWatchProps) => {
    const [time, setTime] = useState(0);
    const intervalIDRef = useRef<NodeJS.Timeout | null>(null);
    const [started, setStarted] = useState(false);
    const [session, setSession] = useState<Session>();
    const { apprenticeUserMachines } = useContext(ApprenticeContext);

    const { data: nextAuthSession, update } = useSession();

    const handleStart = useCallback(async () => {
        if (started) return;
        // transform apprenticeIds into an array of numbers, each in the format apprentice{}Id

        await fetch('/api/admin/session/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userMachineId,
                userId
            })
        })
            .then((res) => res.json())
            .then((res) => setSession(res.session))
            .then(() => {
                setStarted(true);
                update({ runningSession: true });
            })
            .catch((error) => {
                console.error(error);
                setError('An error occurred. Please try again.');
            });
    }, [setError, setSession, update, started, userMachineId, userId]);

    const handleStop = useCallback(async () => {
        if (!started) return;
        await fetch('/api/admin/session/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: session?.id,
                startTime: session?.startTime,
                apprenticeUserMachines
            })
        })
            .then((res) => res.json())
            .then((res) => {
                setSession(res.session),
                    setUserMachineDuration(res.userMachineDuration),
                    setUserLifetimeDuration(res.userLifetimeDuration);
            })
            .then(() => {
                setStarted(false);
                update({ runningSession: false });
            })
            .catch((error) => {
                console.error(error);
                setError('An error occurred. Please try again.');
            });
    }, [
        setError,
        setSession,
        setUserMachineDuration,
        setUserLifetimeDuration,
        update,
        started,
        session,
        apprenticeUserMachines
    ]);

    const startTimer = useCallback(() => {
        if (intervalIDRef.current === null) {
            intervalIDRef.current = setInterval(() => {
                setTime((prev) => (prev !== null ? prev + 1000 : prev));
            }, 1000);
        }
    }, []);

    const stopTimer = useCallback(() => {
        if (intervalIDRef.current !== null) {
            clearInterval(intervalIDRef.current);
            intervalIDRef.current = null;
            setTime(0);
        }
    }, []);

    useEffect(() => {
        if (nextAuthSession?.user?.forceStopSession) {
            handleStop();
        }
    }, [nextAuthSession?.user?.forceStopSession, handleStop]);

    return (
        <div className="flex flex-col items-center justify-center space-y-[2rem]">
            {started ? (
                <div>
                    <div className="text-6xl">
                        <FormattedTime milliseconds={time} />
                    </div>
                    <button
                        className="mx-auto mb-2 mt-[3rem] flex items-center p-2"
                        onClick={() => {
                            stopTimer(), handleStop();
                        }}
                    >
                        <div className="w-[20rem] p-4 text-center text-5xl outline outline-4 active:bg-slate-400">
                            Stop Session
                        </div>
                    </button>
                </div>
            ) : (
                <button
                    className="mx-auto mb-2 mt-[3rem] flex items-center p-[2rem]"
                    onClick={() => {
                        startTimer(), handleStart();
                    }}
                >
                    <div className="w-[80rem] p-[2rem] text-center text-9xl outline outline-4 active:bg-slate-400">
                        Start New Session
                    </div>
                </button>
            )}
        </div>
    );
};

export default SessionStopWatch;
