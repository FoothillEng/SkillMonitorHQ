import { useContext } from 'react';
import Link from 'next/link';

import Title from '@/components/Title';
import ListStudents from '@/components/ListStudents';
import { MachineContext } from '@/lib/contexts/MachineContext';

const AdminMachineIndex = (props) => {
    const { machineUUID } = useContext(MachineContext);

    return (
        <div className="flex w-screen flex-col items-center font-oxygen text-white">
            <Title title="Machine Stats" />
            <div className="mb-[5rem] p-[2rem] text-4xl outline outline-4 active:bg-purple-300 ">
                <Link href={'/admin/machine/addStudent'}>Add Student</Link>
            </div>
            {machineUUID && (
                <ListStudents
                    fetchUrl={`/api/admin/student/get?machineUUID=${machineUUID}`}
                    admin={true}
                />
            )}
        </div>
    );
};

export default AdminMachineIndex;
