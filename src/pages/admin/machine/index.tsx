import { useState } from 'react';

import CreateMachine from '@/components/admin/machine/CreateMachine';
import ListMachines from '@/components/admin/machine/ListMachines';

const AdminMachineIndex = (props) => {
    const [reload, setReload] = useState<boolean>(false);

    return (
        <div className="w-screen flex flex-col items-center justify-around text-green-400 font-oxygen">
            <div className="text-6xl mb-[5rem]">Machine Settings</div>
            <ListMachines reload={reload} setReload={setReload} />
            <CreateMachine setReload={setReload} />
        </div>
    );
};

export default AdminMachineIndex;
