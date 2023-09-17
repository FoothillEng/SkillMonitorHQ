import { useState } from 'react';

import CreateMachine from '@/components/admin/machine/CreateMachine';
import ListMachines from '@/components/admin/machine/ListMachines';

const AdminMachineIndex = (props) => {
    const [reload, setReload] = useState<boolean>(false);

    return (
        <div className="flex w-screen flex-col items-center justify-around font-oxygen text-green-400">
            <div className="mb-[5rem] text-6xl">Machine Settings</div>
            <ListMachines reload={reload} setReload={setReload} />
            <CreateMachine setReload={setReload} />
        </div>
    );
};

export default AdminMachineIndex;
