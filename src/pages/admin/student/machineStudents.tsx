import { useState, useContext } from 'react';

import Title from '@/components/Title';
import ListStudents from '@/components/ListStudents';
import { StudentIdInput } from '@/pages/admin/student/create';
import { MachineContext } from '@/lib/contexts/MachineContext';

const AdminStudentsIndex = (props) => {
    const { machineUUID } = useContext(MachineContext);
    const [studentId, setStudentId] = useState<string>('0');
    const [error, setError] = useState<string>('');
    const [key, setKey] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

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
    };

    return (
        <div className="flex w-screen flex-col items-center font-oxygen">
            <Title title="Machine Stats" />
            <div className="mb-[5rem] flex flex-col items-center p-[2rem] text-4xl active:bg-purple-300 ">
                <div className="text-5xl">Add Student to this Machine</div>
                <div className="mt-[1rem] text-3xl">
                    Note: student must be on system already
                </div>
                <StudentIdInput handleSubmit={setStudentId} />
                <button
                    className="mx-auto mb-2 mt-[2rem] flex items-center p-4 outline outline-4"
                    onClick={handleSubmit}
                >
                    <div className="text-center text-5xl active:bg-slate-400">
                        {studentId !== '0' ? 'Submit' : 'Enter a Student ID'}
                    </div>
                </button>
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
