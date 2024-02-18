import { useEffect, useState } from 'react';

import Machine from '@/components/admin/machine/Machine';
import type { MachineTestQuestions } from '@/components/admin/machine/Machine';

interface ListMachinesProps {
    reload: boolean;
    highlight: boolean;
    setReload: (reload: boolean) => void;
    handleOnClick: (machine: MachineTestQuestions) => void;
}

const ListMachines = ({
    reload,
    highlight,
    setReload,
    handleOnClick
}: ListMachinesProps) => {
    const [machines, setMachines] = useState<MachineTestQuestions[]>([]);

    useEffect(() => {
        const fetchMachines = async () => {
            await fetch('/api/admin/machine/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    const sortedMachines = data.machines.sort(
                        (a: { name: string }, b: { name: string }) =>
                            a.name.localeCompare(b.name)
                    );
                    setMachines(sortedMachines);
                })
                .catch((error) => console.error(error));
        };
        fetchMachines();
        setReload(false);
    }, [reload, setReload]);

    return (
        <div className="flex flex-col items-center">
            {machines && machines.length > 0 && (
                <div className=" space-y-[2rem]">
                    {machines.map((machine) => (
                        <Machine
                            key={machine.id}
                            machine={machine}
                            highlight={highlight}
                            handleOnClick={handleOnClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListMachines;
