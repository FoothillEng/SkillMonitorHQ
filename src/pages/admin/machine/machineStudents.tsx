import { useContext } from 'react';

import Title from '@/components/Title';
import ListStudents from '@/components/ListStudents';
import { MachineContext } from '@/lib/contexts/MachineContext';

const AdminStudentsIndex = (props) => {
    const { machineUUID } = useContext(MachineContext);

    return (
        <div className="flex w-screen flex-col items-center font-oxygen text-white">
            <Title title="Machine Stats" />
            {machineUUID && (
                <ListStudents
                    fetchUrl={`/api/admin/student/get?machineUUID=${machineUUID}`}
                    admin={true}
                />
            )}
        </div>
    );
};

export default AdminStudentsIndex;
