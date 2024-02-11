import { useEffect, useState } from 'react';
import type { Machine as MachineType } from '@prisma/client';

import Machine from '@/components/admin/machine/Machine';

interface ListMachinesProps {
    reload: boolean;
    setReload: (reload: boolean) => void;
}
const ListMachines = ({ reload, setReload }: ListMachinesProps) => {
    const [machines, setMachines] = useState<MachineType[]>([]);

    useEffect(() => {
        const fetchMachines = async () => {
            await fetch('/api/admin/machine/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((data) => setMachines(data.machines))
                .catch((error) => console.error(error));
        };
        fetchMachines();
        setReload(false);
    }, [reload, setReload]);

    return (
        <div className="flex flex-col items-center">
            <div className="mb-[2rem] text-7xl">Registered Machines:</div>
            {machines && machines.length > 0 && (
                <div className="flex flex-col">
                    {machines.map((machine) => (
                        <Machine key={machine.id} machine={machine} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListMachines;
