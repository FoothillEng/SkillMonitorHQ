import { useState } from 'react';

import Title from '@/components/Title';
import CreateMachine from '@/components/admin/machine/CreateMachine';
import ListMachines from '@/components/admin/machine/ListMachines';

const AdminMachineIndex = (props) => {
    const [reload, setReload] = useState<boolean>(false);

    return (
        <div className="flex w-screen flex-col items-center font-oxygen text-white">
            <Title title="Machine Settings" />
            <ListMachines reload={reload} setReload={setReload} />
            <CreateMachine setReload={setReload} />
        </div>
    );
};

export default AdminMachineIndex;
