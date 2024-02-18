import dynamic from 'next/dynamic';
import { useState, useRef, useContext } from 'react';

import type { MachineTestQuestions } from '@/components/admin/machine/Machine';
import { MachineContext } from '@/lib/contexts/MachineContext';

const Tour = dynamic(() => import('@/lib/tours/Tour'), {
    ssr: false
});

import Title from '@/components/Title';
const Modal = dynamic(() => import('@/components/Modal'), {
    ssr: false
});
import FaOptions from '@/components/FaOptions';
import CreateMachine from '@/components/admin/machine/CreateMachine';
import ListMachines from '@/components/admin/machine/ListMachines';

const AdminMachineIndex = (props) => {
    const [reload, setReload] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const selectedMachine = useRef<MachineTestQuestions | null>(null);

    const { setMachineUUID, setMachineName } = useContext(MachineContext);

    const handleMachineClick = async () => {
        if (!selectedMachine.current) return;

        if (selectedMachine.current.testQuestions) {
            // no need to inform there is no safety questions available
            await handleOnClick(true);
        } else {
            setIsOpen(true);
            // need to inform there is no safety questions available
        }
    };

    const handleOnClick = async (choice: boolean) => {
        if (!choice) {
            setIsOpen(false);
            return;
        }
        if (!selectedMachine.current) return;

        await fetch(`/api/machine/get?UUID=${selectedMachine?.current.uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setIsOpen(false);
                if (!selectedMachine.current) return;
                localStorage.setItem(
                    'machineUUID',
                    selectedMachine.current.uuid
                );
                setMachineUUID(selectedMachine.current.uuid);
                setMachineName(data.machine.name);
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className="flex w-screen flex-col items-center font-oxygen text-white">
            <Tour TourType="Machine Settings" />
            <Title title="Machine Settings" />
            <div id="listMachines">
                <div className="mb-[2rem] text-7xl">Registered Machines:</div>
                <ListMachines
                    reload={reload}
                    setReload={setReload}
                    highlight={true}
                    handleOnClick={(machine) => {
                        selectedMachine.current = machine;
                        handleMachineClick();
                    }}
                />
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="w-[95rem] text-center text-7xl text-secondary">
                    <div className="mb-[2rem]">
                        <span>selected machine: </span>
                        <span className=" font-bold">
                            {`${selectedMachine.current?.name} `}
                        </span>
                    </div>
                    <div>
                        This machine has no safety questions available. Are you
                        sure you want to proceed?
                    </div>
                </div>
                <div className="mt-[10rem]">
                    <FaOptions handleConfirm={handleOnClick} />
                </div>
            </Modal>
            <div id="createMachines">
                <CreateMachine setReload={setReload} />
            </div>
        </div>
    );
};

export default AdminMachineIndex;
