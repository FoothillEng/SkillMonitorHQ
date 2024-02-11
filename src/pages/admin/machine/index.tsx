import { useState } from 'react';

import dynamic from 'next/dynamic';
const Tour = dynamic(() => import('@/lib/tours/Tour'), {
    ssr: false
});

import Title from '@/components/Title';
import CreateMachine from '@/components/admin/machine/CreateMachine';
import ListMachines from '@/components/admin/machine/ListMachines';

const AdminMachineIndex = (props) => {
    const [reload, setReload] = useState<boolean>(false);

    return (
        <div className="flex w-screen flex-col items-center font-oxygen text-white">
            <Tour TourType="Machine Settings" />
            <Title title="Machine Settings" />
            <div id="listMachines">
                <ListMachines reload={reload} setReload={setReload} />
            </div>
            <div id="createMachines">
                <CreateMachine setReload={setReload} />
            </div>
        </div>
    );
};

export default AdminMachineIndex;
