import { useEffect, useState } from 'react';
import { User } from '@prisma/client';

import Student from '@/components/Student';

interface ListStudentsProps {
    fetchUrl: string;
    viewId: boolean;
    style?: string;
}

const ListStudents = ({ fetchUrl, viewId, style }: ListStudentsProps) => {
    const [students, setStudents] = useState<User[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchStudents = async () => {
            await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((data) => setStudents(data.students))
                .catch((error) => {
                    console.error(error);
                    setError(error);
                });
        };
        fetchStudents();
    }, [fetchUrl]);
    return (
        <div>
            {students && students.length > 0 ? (
                <div className={style}>
                    {students.map((student) => (
                        <Student
                            key={student.id}
                            student={student}
                            viewId={viewId}
                            col={false}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-xl text-gray-500">
                    No students available.
                </div>
            )}
            {error && (
                <div className="mt-[5rem] text-3xl text-red-500">{error}</div>
            )}
        </div>
    );
};

export default ListStudents;
