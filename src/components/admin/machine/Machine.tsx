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
            console.log('initalLoad');
            if (localStorage.getItem('machineId')) {
                await fetch('/api/admin/machine/decrypt', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        encryptedMachineId: localStorage.getItem('machineId')
                    })
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setCurrentMachineId(data.decryptedMachineId);
                    })
                    .catch((error) => console.error(error));
            }
        };
        initalLoad();
    }, [setCurrentMachineId]);

    const handleOnClick = async () => {
        console.log('Machine clicked', machine.uuid);
        setCurrentMachineId(machine.uuid);
        await fetch('/api/admin/machine/encrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                machineId: machine.uuid
            })
        })
            .then((response) => response.json())
            .then((data) => {
                setMachineId(data.encryptedMachineId);
                localStorage.setItem('machineId', data.encryptedMachineId);
            })
            .catch((error) => console.error(error));
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
