import { useContext, useEffect } from 'react';

import { Machine } from '@prisma/client';
import { MachineIdContext } from '@/lib/contexts/MachineIdContext';

interface MachineProps {
    machine: Machine;
    currentMachineId: string;
    setCurrentMachineId: (machineId: string) => void;
}
const Machine = ({
    machine,
    currentMachineId,
    setCurrentMachineId
}: MachineProps) => {
    const { machineId, setMachineId } = useContext(MachineIdContext);

    // setCurrentMachineId on inital load from localStorage
    useEffect(() => {
        const initalLoad = async () => {
            const machineUUID = localStorage.getItem('machineUUID');
            if (machineUUID) {
                setCurrentMachineId(machineUUID);
                setMachineId(machineUUID);
            }
        };
        initalLoad();
    }, [setCurrentMachineId, setMachineId]);

    const handleOnClick = async () => {
        setCurrentMachineId(machine.uuid);
        setMachineId(machine.uuid);
        localStorage.setItem('machineUUID', machine.uuid);
    };

    return (
        <div
            onClick={handleOnClick}
            className={`flex flex-row items-center justify-center space-x-[2rem] text-purple-400 active:bg-slate-400 ${
                currentMachineId === machine.uuid ? 'text-red-400' : ''
            }`}
        >
            <div className="text-3xl">
                {machine.name} - {machine.id} - {machine.uuid}
            </div>
        </div>
    );
};

export default Machine;
