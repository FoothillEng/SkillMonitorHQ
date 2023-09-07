import { useState, useEffect, useCallback, useRef } from 'react';

import type { Session } from '@prisma/client';

interface SessionStopWatchProps {
    userId: string;
    userMachineId: number;
    setError: (error: string) => void;
}

const SessionStopWatch = ({
    userId,
    userMachineId,
    setError
}: SessionStopWatchProps) => {
    const [session, setSession] = useState<Session>();
    const [time, setTime] = useState(0);
    const intervalIDRef = useRef<NodeJS.Timeout | null>(null);
    const [started, setStarted] = useState(false);

    const handleStart = useCallback(async () => {
        if (started) return;
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
            .then(() => setStarted(true))
            .catch((error) => {
                console.error(error);
                setError('An error occurred. Please try again.');
            });
    }, [setError, setSession, started, userMachineId, userId]);

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
            .then((res) => setSession(res.session))
            .then(() => setStarted(false))
            .catch((error) => {
                console.error(error);
                setError('An error occurred. Please try again.');
            });
    }, [setError, setSession, started, session]);

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
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-[2rem]">
            <div className="text-5xl">
                <span>
                    {('0' + Math.floor((time / 60000) % 60)).slice(-2)}:
                </span>
                <span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                <span>{('0' + ((time / 10) % 100)).slice(-2)}</span>
            </div>
            <div className="flex flex-row space-x-[3rem]">
                <button
                    className="flex items-center mt-[3rem] mx-auto mb-2 p-2"
                    onClick={() => {
                        startTimer(), handleStart();
                    }}
                >
                    <div className="w-[10rem] outline outline-4 p-4 active:bg-slate-400 text-5xl text-center">
                        Start
                    </div>
                </button>
                <button
                    className="flex items-center w-[10rem] mt-[3rem] mx-auto mb-2 p-2"
                    onClick={() => {
                        stopTimer(), handleStop();
                    }}
                >
                    <div className="w-[10rem] outline outline-4 p-4 active:bg-slate-400 text-5xl text-center">
                        Stop
                    </div>
                </button>
            </div>
        </div>
    );
};

export default SessionStopWatch;
