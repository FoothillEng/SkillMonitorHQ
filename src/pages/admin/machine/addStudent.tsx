import { useState, useContext } from 'react';
import { useRouter } from 'next/router';

import Title from '@/components/Title';

import { MachineContext } from '@/lib/contexts/MachineContext';

import { StudentIdInput } from '@/pages/admin/student/createStudent';

const AdminMachineAdd: React.FC = (props) => {
    const { machineName, machineUUID } = useContext(MachineContext);
    const [error, setError] = useState<string>('');
    const router = useRouter();

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
        }).then((res) => {
            if (res.status === 200) {
                router.push('/admin/machine/');
            } else if (res.status === 401) {
                setError('Student is already on the machine');
            } else if (res.status === 404) {
                setError('Student not found');
            }
        });
        // how to forcible rerednder a component to reset its state. need to reset StudentIDInput if want to addm ultple studnts ti current machien~
    };

    return (
        <div className="flex w-screen flex-col items-center font-oxygen text-white">
            <Title title={`Add student to ${machineName}`} />
            <div className="flex flex-col items-center p-[2rem] text-4xl ">
                <div className="mb-[5rem] text-3xl">
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
        </div>
    );
};

export default AdminMachineAdd;
