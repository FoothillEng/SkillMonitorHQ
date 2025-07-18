import { useContext } from 'react';
import Link from 'next/link';

import Title from '@/components/Title';
import ListStudents from '@/components/ListStudents';
import { MachineContext } from '@/lib/contexts/MachineContext';

const AdminStudentsIndex = (props) => {
    const { machineUUID } = useContext(MachineContext);
    return (
        <div className="flex w-screen flex-col items-center font-oxygen text-white ">
            <Title title="Student Stats" />
            <div className="mb-[5rem] p-[2rem] text-4xl outline outline-4 active:bg-purple-300 ">
                <Link href={'/admin/student/createStudent'}>
                    Create Student
                </Link>
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
