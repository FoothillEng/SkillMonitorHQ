import { useState, useContext } from 'react';
import dynamic from 'next/dynamic';

import { MachineContext } from '@/lib/contexts/MachineContext';
import {
    ApprenticeContext,
    type ApprenticeUser
} from '@/lib/contexts/ApprenticeContext';

const Modal = dynamic(() => import('@/components/Modal'), { ssr: false });
import FaOptions from '@/components/FaOptions';
import CldAvatar from '@/components/CldAvatar';
import { FaPlus } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';

import LockScreen from '@/components/LockScreen';

interface ApprenticeProps {
    index: number;
    apprentice: ApprenticeUser;
    setAllApprentices: React.Dispatch<React.SetStateAction<ApprenticeUser[]>>;
    allApprentices: ApprenticeUser[];
    onApprenticeAdded: () => void;
}

const Apprentice = ({
    index: i,
    apprentice,
    setAllApprentices,
    allApprentices,
    onApprenticeAdded
}: ApprenticeProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const [removeIsOpen, setRemoveIsOpen] = useState(false);
    const [removeApprentice, setRemoveApprentice] = useState<ApprenticeUser>();

    const { machineUUID } = useContext(MachineContext);

    const handleAddApprentice = async (
        studentId: string,
        setStudentId: any,
        setErrorMessage: any
    ) => {
        if (
            allApprentices
                .filter(Boolean)
                .some(
                    (apprentice) =>
                        apprentice.studentId.toString() === studentId
                )
        ) {
            setErrorMessage('Apprentice already added');
            return;
        }
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
            }
        } catch (error: any) {
            setErrorMessage(error);
        }
        setStudentId('');
    };

    const handleRemoveApprentice = async (choice: boolean) => {
        if (!choice || !removeApprentice) {
            setRemoveIsOpen(false);
            return;
        }

        setAllApprentices((prev: ApprenticeUser[]) => {
            let newApprentices = [...prev];
            newApprentices.splice(newApprentices.indexOf(removeApprentice), 1);
            return newApprentices;
        });
        setRemoveIsOpen(false);
    };

    return (
        <div
            className={`mt-[5rem] flex h-[30rem] w-[30rem] items-center justify-center font-oxygen ${
                apprentice ? '' : 'outline outline-[1rem]'
            }`}
            onClick={() => {
                if (!apprentice) setIsOpen(true);
            }}
        >
            {apprentice ? (
                <span
                    onClick={() => {
                        setRemoveApprentice(apprentice);
                        setRemoveIsOpen(true);
                    }}
                >
                    <CldAvatar
                        avatar={apprentice.avatar}
                        level={apprentice.level}
                        size={'extraLarge'}
                    />
                </span>
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
            {removeApprentice && (
                <Modal
                    isOpen={removeIsOpen}
                    onClose={() => setRemoveIsOpen(false)}
                >
                    <div className="w-[95rem] text-center text-7xl text-secondary">
                        <div className="mb-[2rem]">
                            <span>selected apprentice: </span>
                            <span className=" font-bold">
                                {`${removeApprentice?.firstName} `}
                            </span>
                        </div>
                        <div>
                            Are you sure you want to remove this apprentice?
                        </div>
                    </div>
                    <div className="mt-[10rem]">
                        <FaOptions handleConfirm={handleRemoveApprentice} />
                    </div>
                </Modal>
            )}
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
