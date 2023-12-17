import { useEffect, useState } from 'react';

import { useSession, signOut } from 'next-auth/react';
import { FormattedTime } from '@/pages/index';

const AuthSessionTimer = () => {
    const [time, setTime] = useState(0);
    const [error, setError] = useState('');

    const { data: nextAuthSession, status } = useSession();

    const getTimeRemaining = async () => {
        await fetch('/api/admin/session/getTimeRemaining')
            .then((res) => {
                if (res.status === 401) {
                    signOut();
                }
                return res.json();
            })
            .then((res) => {
                console.log(res);
                if (res.message !== 'Unauthorized') {
                    setTime(res.timeRemaining);
                } else {
                    setTime(0);
                }
            })
            .catch((error) => {
                console.error(error);
                setError('An error occurred. Please try again.');
            });
    };

    useEffect(() => {
        console.log(nextAuthSession?.user, status);
        if (status === 'authenticated') {
            getTimeRemaining();

            const intervalId1 = setInterval(getTimeRemaining, 10000);

            const intervalId2 = setInterval(() => {
                setTime((prev) => (prev !== null ? prev - 1000 : prev));
            }, 1000);

            return () => {
                clearInterval(intervalId1);
                clearInterval(intervalId2);
            };
        }
    }, [nextAuthSession?.user, status]);

    return (
        <div className="fixed right-[30rem] top-[2rem] p-4 text-lg text-white">
            {nextAuthSession && (
                <div className="flex flex-col items-center font-oxygen text-fhs-yellow">
                    <h1 className="text-4xl">Time left:</h1>
                    <FormattedTime milliseconds={time} />
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default AuthSessionTimer;
