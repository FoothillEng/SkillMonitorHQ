import { useState, useContext } from 'react';

import { FaPlus, FaUserCheck } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { User } from '@prisma/client';

import { Toast } from 'flowbite-react';

import { MachineContext } from '@/lib/contexts/MachineContext';
import { ApprenticeContext } from '@/lib/contexts/ApprenticeContext';
import Student from '@/components/Student';
import LockScreen from '@/components/LockScreen';

// export const CustomToast = ({ text }: { text: string }) => {
//     return (
//         <Toast className="mt-[2rem]">
//             <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg  bg-cyan-800 text-cyan-200">
//                 <FaUserCheck className="h-5 w-5" />
//             </div>
//             <div className="ml-3 text-3xl font-normal">{text}</div>
//             <Toast.Toggle />
//         </Toast>
//     );
// };

const Apprentice = ({
    onApprenticeAdded
}: {
    onApprenticeAdded: () => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [apprentice, setApprentice] = useState<User>();
    const { machineUUID } = useContext(MachineContext);
    const { setApprenticeUserMachines } = useContext(ApprenticeContext);

    async function handleSubmit(
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
                setApprentice(data.apprentice);
                setIsOpen(false);
                onApprenticeAdded();
                // setApprenticeIds((prev: string[]) => [...prev, studentId]);
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
            className="mt-[5rem] flex h-[20rem] w-[20rem] items-center justify-center font-oxygen outline outline-[1rem]"
            onClick={() => setIsOpen(true)}
        >
            {apprentice ? (
                <Student student={apprentice} viewId={false} col={true} />
            ) : (
                <FaPlus size="15rem" />
            )}

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto flex h-[65rem] w-[50rem] items-center justify-center rounded bg-white text-center">
                        <LockScreen
                            placeholder="Enter Apprentice ID"
                            handleSubmit={handleSubmit}
                        />
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

const ApprenticeView = () => {
    const [isApprenticeAdded, setIsApprenticeAdded] = useState(false);

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
                            onApprenticeAdded={handleApprenticeAdded}
                        />
                    ))}
            </div>
        </div>
    );
};

export default ApprenticeView;
