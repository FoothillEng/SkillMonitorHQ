import { useState } from 'react';

import CreateMachine from '@/components/admin/machine/CreateMachine';
import ListMachines from '@/components/admin/machine/ListMachines';

import { MachineIdContext } from '@/lib/contexts/MachineIdContext';
import { prisma } from '@/lib/prisma';

const AdminMachineIndex = (props) => {
    const [machineId, setMachineId] = useState<string>('');
    const [reload, setReload] = useState<boolean>(false);

    return (
        <div className="w-screen flex flex-col items-center justify-around text-green-400 font-oxygen">
            <div className="text-6xl mb-[5rem]">Machine Settings</div>
            <MachineIdContext.Provider value={{ machineId, setMachineId }}>
                <ListMachines reload={reload} setReload={setReload} />
                <CreateMachine setReload={setReload} />
            </MachineIdContext.Provider>
        </div>
    );
};

export default AdminMachineIndex;
