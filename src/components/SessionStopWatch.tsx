import { useState, useCallback, useRef, useContext, useEffect } from 'react';

import type { Session } from '@prisma/client';

import { ApprenticeContext } from '@/lib/contexts/ApprenticeContext';
import { AuthContext } from '@/lib/contexts/AuthContext';

import FormattedTime from '@/components/FormattedTime';

interface SessionStopWatchProps {
    userId: string;
    userMachineId: number;
    updateUserMachineStats: (
        userMachineDuration: number,
        userMachineSessions: number,
        userLifetimeDuration: number,
        userLifetimeSessions: number
    ) => void;
    setError: (error: string) => void;
}

const SessionStopWatch = ({
    userId,
    userMachineId,
    updateUserMachineStats,
    setError
}: SessionStopWatchProps) => {
    const [time, setTime] = useState(0);
    const intervalIDRef = useRef<NodeJS.Timeout | null>(null);
    const [started, setStarted] = useState(false);
    const [session, setSession] = useState<Session>();
    const { apprentices } = useContext(ApprenticeContext);
    const { forceStopSession, setRunningSession } = useContext(AuthContext);

    const handleStart = useCallback(async () => {
        if (started) return;
        // transform apprenticeIds into an array of numbers, each in the format apprentice{}Id

        await fetch('/api/session/start', {
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
                setRunningSession(true);
            })
            .catch((error) => {
                console.error(error);
                setError('An error occurred. Please try again.');
            });
    }, [
        setError,
        setSession,
        setRunningSession,
        started,
        userMachineId,
        userId
    ]);

    const handleStop = useCallback(async () => {
        if (!started) return;
        await fetch('/api/session/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: session?.id,
                startTime: session?.startTime,
                apprentices
            })
        })
            .then((res) => res.json())
            .then((res) => {
                setSession(res.session),
                    updateUserMachineStats(
                        res.userMachineDuration,
                        res.userMachineSessions,
                        res.userLifetimeDuration,
                        res.userLifetimeSessions
                    );
            })
            .then(() => {
                setStarted(false);
                setRunningSession(false);
            })
            .catch((error) => {
                console.error(error);
                setError('An error occurred. Please try again.');
            });
    }, [
        setError,
        setSession,
        updateUserMachineStats,
        setRunningSession,
        started,
        session,
        apprentices
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
        if (forceStopSession) {
            handleStop();
        }
    }, [forceStopSession, handleStop]);

    useEffect(() => {
        const handleUnload = () => {
            setRunningSession(false);
        };
        window.addEventListener('unload', handleUnload);
        return () => {
            window.removeEventListener('unload', handleUnload);
        };
    }, [setRunningSession]);

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
                        <div className="w-[30rem] p-[2rem] text-center text-5xl text-primary outline outline-[1rem] outline-primary active:bg-slate-400">
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
