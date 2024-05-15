import { useEffect, useState, useContext } from 'react';

import { useSession, signOut } from 'next-auth/react';

import { Dialog } from '@headlessui/react';

import { AuthContext } from '@/lib/contexts/AuthContext';
import LockScreen from '@/components/LockScreen';
import FormattedTime from '@/components/FormattedTime';

const AutoLogoutTimer = () => {
    const [time, setTime] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [adminSet, setAdminSet] = useState(false); // setTimeout to clear and set to false
    const [error, setError] = useState('');

    const { data: nextAuthSession, status, update } = useSession();
    const { forceStopSession, setForceStopSession } = useContext(AuthContext);

    useEffect(() => {
        if (status === 'authenticated') {
            const getTimeRemaining = async () => {
                const timeRemaining =
                    nextAuthSession?.user.realExpTime -
                    Math.floor(Date.now() / 1000);

                if (timeRemaining <= 0) {
                    if (!forceStopSession) {
                        setForceStopSession(true);
                    }
                    setTimeout(() => {
                        signOut();
                    }, 5000);
                }

                setTime(timeRemaining * 1000);
            };

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
    }, [nextAuthSession?.user, status, forceStopSession, setForceStopSession]);

    const handleSubmit1 = async (
        studentId: string,
        setStudentId: any,
        setError: any
    ) => {
        const adminId = parseInt(studentId);

        if (isNaN(adminId)) {
            setError('Please enter a valid number');
            return;
        }

        await fetch(`/api/machine/checkAdmin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ adminId }) // technically should be encrypted...
        })
            .then((res) => {
                if (res.status === 401) {
                    setError('Invalid Admin ID');
                } else {
                    setAdminSet(true);
                }
            })
            .catch((error) => {
                console.error(error);
                setError('An error occurred. Please try again.'); // TODO: where does this error lead to
            });
    };

    const handleSubmit2 = async (
        studentId: string,
        setStudentId: any,
        setError: any
    ) => {
        const minutes = parseInt(studentId);

        if (!adminSet) {
            setError('Please enter Admin ID first');
            return;
        }

        if (isNaN(minutes)) {
            setError('Please enter a valid number');
            return;
        }

        if (minutes < 1 || minutes > 3000) {
            setError('Please enter a number between 1 and 3000');
            return;
        }

        update({
            realExpTime: nextAuthSession?.user.realExpTime + minutes * 60
        });

        setIsOpen(false);
        setAdminSet(false);
    };

    return (
        <div className="fixed right-[5rem] top-[50rem] text-lg text-white">
            {nextAuthSession && (
                <div className="text-center font-oxygen text-secondary">
                    <div
                        className="flex h-[10rem] w-[28rem] flex-col justify-center p-[2rem] outline outline-4 outline-primary"
                        onClick={() => setIsOpen(true)}
                    >
                        {/* <h1 className="text-4xl"> :</h1> */}
                        <div className="flex flex-col text-3xl">
                            <p className="text-4xl">AutoLogout</p>
                            <FormattedTime milliseconds={time} />
                        </div>
                        <h2 className="text-2xl">
                            click here to extend session time!
                        </h2>
                        <Dialog
                            open={isOpen}
                            onClose={() => setIsOpen(false)}
                            className="relative z-50"
                        >
                            <div
                                className="fixed inset-0 bg-black/80"
                                aria-hidden="true"
                            />

                            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                                <Dialog.Panel className="mx-auto flex h-[95rem] w-[65rem] items-center justify-center rounded bg-green-500 text-center">
                                    {(!adminSet && (
                                        <LockScreen
                                            placeholder={'Enter Admin ID'}
                                            start={''}
                                            handleSubmit={handleSubmit1}
                                            key={1}
                                        />
                                    )) || (
                                        <LockScreen
                                            placeholder={
                                                'Enter total # of minutes to add to session time (max 50h~3000m)'
                                            }
                                            start={''}
                                            handleSubmit={handleSubmit2}
                                            key={2}
                                        />
                                    )}
                                </Dialog.Panel>
                            </div>
                        </Dialog>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutoLogoutTimer;
