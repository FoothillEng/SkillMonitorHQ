import { useContext } from 'react';

import type { Machine } from '@prisma/client';
import { MachineContext } from '@/lib/contexts/MachineContext';

interface MachineProps {
    machine: Machine;
    currentMachineUUID: string;
    setCurrentMachineUUID: (machineUUID: string) => void;
}
const Machine = ({
    machine,
    currentMachineUUID,
    setCurrentMachineUUID
}: MachineProps) => {
    const { setMachineUUID, setMachineName, machineUUID } =
        useContext(MachineContext);

    const handleOnClick = async () => {
        setCurrentMachineUUID(machine.uuid);
        setMachineUUID(machine.uuid);
        localStorage.setItem('machineUUID', machine.uuid);

        await fetch(`/api/machine/get?UUID=${machine.uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setMachineName(data.machine.name);
            })
            .catch((error) => console.error(error));
    };

    return (
        <div
            onClick={handleOnClick}
            className={`flex flex-row items-center justify-center space-x-[2rem] active:bg-slate-400 ${
                machineUUID === machine.uuid ? 'text-red-400' : ''
            }`}
        >
            <div className="text-3xl">
                {/* {machine.name} - {machine.id} - {machine.uuid} */}
                {machine.name}
            </div>
        </div>
    );
};

export default Machine;
