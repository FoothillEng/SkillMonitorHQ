import { useState, useCallback, useRef, useContext } from 'react';

import type { Session } from '@prisma/client';

import { ApprenticeContext } from '@/lib/contexts/ApprenticeContext';

import { FormattedTime } from '@/pages/index';

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
                userId,
                apprenticeUserMachines
            })
        })
            .then((res) => res.json())
            .then((res) => setSession(res.session))
            .then(() => setStarted(true))
            .catch((error) => {
                console.error(error);
                setError('An error occurred. Please try again.');
            });
    }, [
        setError,
        setSession,
        started,
        userMachineId,
        userId,
        apprenticeUserMachines
    ]);

    const handleStop = useCallback(async () => {
        if (!started) return;
        await fetch('/api/admin/session/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: session?.id,
                startTime: session?.startTime
            })
        })
            .then((res) => res.json())
            .then((res) => {
                setSession(res.session),
                    setUserMachineDuration(res.userMachineDuration),
                    setUserLifetimeDuration(res.userLifetimeDuration);
            })
            .then(() => setStarted(false))
            .catch((error) => {
                console.error(error);
                setError('An error occurred. Please try again.');
            });
    }, [
        setError,
        setSession,
        setUserMachineDuration,
        setUserLifetimeDuration,
        started,
        session
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

    return (
        <div className="flex flex-col items-center justify-center space-y-[2rem]">
            <div className="text-6xl">
                <FormattedTime milliseconds={time} />
            </div>

            {started ? (
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
            ) : (
                <button
                    className="mx-auto mb-2 mt-[3rem] flex items-center p-2"
                    onClick={() => {
                        startTimer(), handleStart();
                    }}
                >
                    <div className="w-[30rem] p-[2rem] text-center text-5xl outline outline-4 active:bg-slate-400">
                        Start New Session
                    </div>
                </button>
            )}
        </div>
    );
};

export default SessionStopWatch;
