import { useContext } from 'react';
import Link from 'next/link';

import ListStudents from '@/components/ListStudents';
import { MachineContext } from '@/lib/contexts/MachineContext';

const AdminStudentsIndex = (props) => {
    const { machineUUID } = useContext(MachineContext);
    return (
        <div className="flex w-screen flex-col items-center font-oxygen text-white ">
            <div className="mb-[5rem] p-[2rem] text-4xl outline outline-4 active:bg-purple-300 ">
                <Link href={'/admin/student/create'}>New Student</Link>
            </div>
            {machineUUID && (
                <ListStudents
                    fetchUrl={`/api/admin/student/get`}
                    admin={true}
                />
            )}
        </div>
    );
};

export default AdminStudentsIndex;
