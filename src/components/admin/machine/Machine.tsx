import { useContext } from 'react';

import type { Machine } from '@prisma/client';
import { MachineContext } from '@/lib/contexts/MachineContext';

interface MachineProps {
    machine: Machine;
    highlight: boolean;
    handleOnClick: (machine: Machine) => void;
}
const Machine = ({ highlight, machine, handleOnClick }: MachineProps) => {
    const { machineUUID } = useContext(MachineContext);

    return (
        <div
            onClick={handleOnClick.bind(this, machine)}
            className={`flex flex-row items-center justify-center space-x-[2rem] active:bg-slate-400 ${
                (highlight && machineUUID) === machine.uuid
                    ? 'text-red-400'
                    : ''
            }`}
        >
            <div className="text-5xl">{machine.name}</div>
        </div>
    );
};

export default Machine;
