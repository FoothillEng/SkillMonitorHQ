import { useEffect, useState } from 'react';

import { useSession, signOut } from 'next-auth/react';

import { Dialog } from '@headlessui/react';

import LockScreen from '@/components/LockScreen';
import { FormattedTime } from '@/pages/index';

const AutoLogoutTimer = () => {
    const [time, setTime] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');

    const { data: nextAuthSession, status, update } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            const getTimeRemaining = async () => {
                const timeRemaining =
                    nextAuthSession?.user.realExpTime -
                    Math.floor(Date.now() / 1000);
                console.log(nextAuthSession?.user.realExpTime, timeRemaining);

                if (timeRemaining <= 0) {
                    signOut();
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
    }, [nextAuthSession?.user, status]);

    const handleSubmit = async (
        studentId: string,
        setStudentId: any,
        setError: any
    ) => {
        const adminId = parseInt(studentId);

        await fetch(`/api/checkAdmin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ adminId })
        })
            .then((res) => {
                if (res.status === 401) {
                    setError('Invalid Admin ID');
                } else {
                    update({
                        realExpTime: nextAuthSession?.user.realExpTime + 1800
                    });
                }
                setIsOpen(false);
            })
            .catch((error) => {
                console.error(error);
                setError('An error occurred. Please try again.'); // TODO: where does this error lead to
            });

        setIsOpen(false);
    };

    return (
        <div className="fixed right-[5rem] top-[50rem] text-lg text-white">
            {nextAuthSession && (
                <div className="text-center font-oxygen text-fhs-yellow">
                    <div className="flex h-[10rem] w-[40rem] flex-col justify-center p-[5rem] outline outline-4 outline-fhs-blue">
                        {/* <h1 className="text-4xl"> :</h1> */}
                        <div className="text-3xl">
                            <FormattedTime
                                prependedString="Autologout in: "
                                milliseconds={time}
                            />
                        </div>
                        <div>
                            <h2
                                onClick={() => setIsOpen(true)}
                                className="text-2xl"
                            >
                                click here to extend session time!
                            </h2>
                            <Dialog
                                open={isOpen}
                                onClose={() => setIsOpen(false)}
                                className="relative z-50"
                            >
                                <div
                                    className="fixed inset-0 bg-black/20"
                                    aria-hidden="true"
                                />

                                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                                    <Dialog.Panel className="mx-auto flex h-[65rem] w-[50rem] items-center justify-center rounded bg-green-500 text-center">
                                        <LockScreen
                                            placeholder={'Enter Admin ID'}
                                            start={''}
                                            handleSubmit={handleSubmit}
                                        />
                                    </Dialog.Panel>
                                </div>
                            </Dialog>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutoLogoutTimer;
