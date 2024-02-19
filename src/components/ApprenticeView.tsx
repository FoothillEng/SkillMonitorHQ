import { useState, useContext } from 'react';

import { User } from '@prisma/client';

import { MachineContext } from '@/lib/contexts/MachineContext';
import {
    ApprenticeContext,
    type ApprenticeUser
} from '@/lib/contexts/ApprenticeContext';

import CldAvatar from '@/components/CldAvatar';
import { FaPlus, FaUserCheck } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';

import LockScreen from '@/components/LockScreen';

const Apprentice = ({
    index: i,
    apprentice,
    setAllApprentices,
    allApprentices,
    onApprenticeAdded
}: ApprenticeProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [apprentice, setApprentice] = useState<User>();
    const { machineUUID } = useContext(MachineContext);

    const handleAddApprentice = async (
        studentId: string,
        setStudentId: any,
        setErrorMessage: any
    ) {
        try {
            const response = await fetch('/api/apprentice/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentId,
                    machineUUID
                })
            });

            const data = await response.json();
            if (data.message) {
                setErrorMessage(data.message);
            } else {
                setAllApprentices((prev: ApprenticeUser[]) => {
                    const newApprentices = [...prev];
                    newApprentices[i] = data.apprentice;
                    newApprentices[i]['apprenticeMachineId'] =
                        data.apprenticeMachineId;
                    return newApprentices;
                });
                setIsOpen(false);
                onApprenticeAdded();
                setApprenticeUserMachines(
                    (
                        prev: { apprenticeId: string; userMachineId: number }[]
                    ) => [
                        ...prev,
                        {
                            apprenticeId: studentId,
                            userMachineId: data.userMachineId
                        }
                    ]
                );
            }
        } catch (error: any) {
            setErrorMessage(error);
        }
        setStudentId('');
    }

    return (
        <div
            className={`mt-[5rem] flex h-[30rem] w-[30rem] items-center justify-center font-oxygen ${
                apprentice ? '' : 'outline outline-[1rem]'
            }`}
            onClick={() => setIsOpen(true)}
        >
            {apprentice ? (
                <CldAvatar
                    avatar={apprentice.avatar}
                    level={apprentice.level}
                    size={'extraLarge'}
                />
            ) : (
                <FaPlus size="15rem" />
            )}

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto flex h-[75rem] w-[55rem] items-center justify-center rounded bg-primary-400 text-center">
                        <LockScreen
                            placeholder="Enter Apprentice ID"
                            handleSubmit={handleAddApprentice}
                        />
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

const ApprenticeView = () => {
    const [isApprenticeAdded, setIsApprenticeAdded] = useState(false);

    const { apprentices, setApprentices } = useContext(ApprenticeContext);

    const handleApprenticeAdded = () => {
        setIsApprenticeAdded(true);
    };

    return (
        <div className="mt-[5rem] font-oxygen ">
            {/* {isApprenticeAdded && (
                <CustomToast text="Apprentice has been added" /> // looks ugly and lwk useless
            )} */}
            <div className="flex flex-row space-x-[20rem]">
                {Array(3)
                    .fill('')
                    .map((_, i) => (
                        <Apprentice
                            key={i}
                            index={i}
                            apprentice={apprentices[i]}
                            setAllApprentices={setApprentices}
                            allApprentices={apprentices}
                            onApprenticeAdded={handleApprenticeAdded}
                        />
                    ))}
            </div>
        </div>
    );
};

export default ApprenticeView;
