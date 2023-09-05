import { useContext, useEffect } from 'react';

import { Machine } from '@prisma/client';
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
    const { setMachineUUID, setMachineName } = useContext(MachineContext);

    // setCurrentMachineId on inital load from localStorage
    useEffect(() => {
        const initalLoad = async () => {
            const machineUUID = localStorage.getItem('machineUUID');
            if (machineUUID) {
                setCurrentMachineUUID(machineUUID);
                setMachineUUID(machineUUID);

                await fetch(`/api/admin/machine/get?UUID=${machineUUID}`, {
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
            }
        };
        initalLoad();
    }, [setCurrentMachineUUID, setMachineUUID, setMachineName]);

    const handleOnClick = async () => {
        setCurrentMachineUUID(machine.uuid);
        setMachineUUID(machine.uuid);
        localStorage.setItem('machineUUID', machine.uuid);

        await fetch(`/api/admin/machine/get?UUID=${machine.uuid}`, {
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
            className={`flex flex-row items-center justify-center space-x-[2rem] text-green-400 active:bg-slate-400 ${
                currentMachineUUID === machine.uuid ? 'text-red-400' : ''
            }`}
        >
            <div className="text-3xl">
                {machine.name} - {machine.id} - {machine.uuid}
            </div>
        </div>
    );
};

export default Machine;
