import { useState, useContext } from 'react';

import type { Machine } from '@prisma/client';
import { MachineContext } from '@/lib/contexts/MachineContext';
import dynamic from 'next/dynamic';
const Tour = dynamic(() => import('@/lib/tours/Tour'), {
    ssr: false
});

import Title from '@/components/Title';
import CreateMachine from '@/components/admin/machine/CreateMachine';
import ListMachines from '@/components/admin/machine/ListMachines';

const AdminMachineIndex = (props) => {
    const [reload, setReload] = useState<boolean>(false);

    const { setMachineUUID, setMachineName } = useContext(MachineContext);

    const handleOnClick = async (machine: Machine) => {
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
        <div className="flex w-screen flex-col items-center font-oxygen text-white">
            <Tour TourType="Machine Settings" />
            <Title title="Machine Settings" />
            <div id="listMachines">
                <div className="mb-[2rem] text-7xl">Registered Machines:</div>
                <ListMachines
                    reload={reload}
                    setReload={setReload}
                    highlight={true}
                    handleOnClick={handleOnClick}
                />
            </div>
            <div id="createMachines">
                <CreateMachine setReload={setReload} />
            </div>
        </div>
    );
};

export default AdminMachineIndex;
