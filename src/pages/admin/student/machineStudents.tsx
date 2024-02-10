import { useState, useContext } from 'react';

import Title from '@/components/Title';
import ListStudents from '@/components/ListStudents';
import { StudentIdInput } from '@/pages/admin/student/create';
import { MachineContext } from '@/lib/contexts/MachineContext';

const AdminStudentsIndex = (props) => {
    const { machineUUID } = useContext(MachineContext);
    const [error, setError] = useState<string>('');
    const [key, setKey] = useState(0);

    const handleSubmit = async (studentId: string) => {
        if (studentId.length < 5) {
            setError('Please enter a valid student ID');
            return;
        }
        const res = await fetch('/api/admin/machine/addStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId,
                machineUUID
            })
        });
        if (res.status !== 200) {
            setError('Error adding student to machine');
            return;
        }
        setKey(key + 1); // force re-render of student list
        // how to forcible rerednder a component to reset its state. need to reset StudentIDInput if want to addm ultple studnts ti current machien~
    };

    return (
        <div className="flex w-screen flex-col items-center font-oxygen">
            <Title title="Machine Stats" />
            <div className="mb-[5rem] flex flex-col items-center p-[2rem] text-4xl ">
                <div className="text-5xl">Add Student to this Machine</div>
                <div className="mb-[5rem] mt-[2rem] text-3xl">
                    Note: student must be on system already
                </div>
                <StudentIdInput
                    handleSubmit={(value) => {
                        handleSubmit(value);
                    }}
                />
                {error && (
                    <div className="mt-[2rem] text-5xl text-red">{error}</div>
                )}
            </div>
            {machineUUID && (
                <ListStudents
                    fetchUrl={`/api/admin/student/get?machineUUID=${machineUUID}&key=${key}`}
                    admin={true}
                />
            )}
        </div>
    );
};

export default AdminStudentsIndex;
