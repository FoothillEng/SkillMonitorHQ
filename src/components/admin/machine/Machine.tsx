import { useContext } from 'react';

import type { Machine as MachineType } from '@prisma/client';
import { FaQuestion } from 'react-icons/fa';

import { MachineContext } from '@/lib/contexts/MachineContext';

export type MachineTestQuestions = MachineType & { testQuestions: boolean };

interface MachineProps {
    machine: MachineTestQuestions;
    highlight: boolean;
    handleOnClick: (machine: MachineTestQuestions) => void;
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
            <FaQuestion
                size={'4rem'}
                color={machine.testQuestions ? 'green' : 'red'}
            />
        </div>
    );
};

export default Machine;
