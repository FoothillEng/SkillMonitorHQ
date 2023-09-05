import { useEffect, useState } from 'react';
import { User } from '@prisma/client';

import Student from '@/components/Student';

const ListStudents = (props) => {
    const [students, setStudents] = useState<User[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            await fetch('/api/admin/getStudents', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((data) => setStudents(data.students))
                .catch((error) => console.error(error));
        };
        fetchStudents();
    }, []);
    return (
        <div>
            {students && students.length > 0 && (
                <div>
                    {students.map((student) => (
                        <Student key={student.id} {...student} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListStudents;
