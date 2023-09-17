import { useContext } from 'react';
import Link from 'next/link';

import ListStudents from '@/components/ListStudents';
import { MachineContext } from '@/lib/contexts/MachineContext';

const AdminStudentsIndex = (props) => {
    const { machineUUID } = useContext(MachineContext);
    return (
        <div className="flex w-screen flex-col items-center font-oxygen text-green">
            <div className="mb-[5rem] p-[2rem] text-4xl outline outline-4 active:bg-purple-300 ">
                <Link href={'/admin/student/create'}>New Student</Link>
            </div>
            <ListStudents
                fetchUrl={`/api/admin/student/get?machineUUID=${machineUUID}`}
                viewId={true}
                style={'flex flex-col space-y-[2rem]'}
            />
        </div>
    );
};

export default AdminStudentsIndex;
