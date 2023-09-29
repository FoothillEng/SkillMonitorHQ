import { useEffect, useState } from 'react';
import { User } from '@prisma/client';

import { FaCheck, FaTimes } from 'react-icons/fa';

import { FormattedTime } from '@/pages/index';
import CldAvatar from '@/components/CldAvatar';

interface ListStudentsProps {
    fetchUrl: string;
    admin?: boolean;
}

type StudentWithPartialUMI = User & {
    apprentice: boolean;
    userMachineId: number;
    duration: number;
    usageCount: number;
    averageRating: number;
};

const ListStudents = ({ fetchUrl, admin }: ListStudentsProps) => {
    const [students, setStudents] = useState<StudentWithPartialUMI[]>([]);
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

    const handleChange = (student: StudentWithPartialUMI, current: boolean) => {
        fetch(`/api/admin/student/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userMachineId: student.userMachineId,
                apprentice: !current
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setError(data.message);
                } else {
                    setStudents((prev) =>
                        prev.map((prevStudent) =>
                            prevStudent.id === student.id
                                ? {
                                      ...prevStudent,
                                      apprentice: data.apprentice
                                  }
                                : prevStudent
                        )
                    );
                }
            })
            .catch((error) => {
                console.error(error);
                setError(error);
            });
    };

    return (
        <div>
            {students && students.length > 0 ? (
                <table className="border-separate border-spacing-[5rem] text-center">
                    <thead className="text-4xl">
                        {admin && students[0].usageCount !== undefined && (
                            <tr>
                                <th>Avatar</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Student ID</th>
                                <th>Apprentice</th>
                                <th>Time on this machine</th>
                                <th>Usage Count</th>
                                <th>Average Rating</th>
                            </tr>
                        )}
                        {admin && students[0].usageCount === undefined && (
                            <tr>
                                <th>Avatar</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Student ID</th>
                                <th>Time on all machines</th>
                            </tr>
                        )}
                        {!admin && (
                            <tr>
                                <th>Avatar</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                            </tr>
                        )}
                    </thead>
                    <tbody className="text-3xl capitalize">
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className="flex justify-center">
                                    <CldAvatar
                                        avatar={student.avatar}
                                        level={student.level}
                                        size={'MEDIUM'}
                                    />
                                </td>
                                <td> {student.firstName}</td>
                                <td> {student.lastName}</td>
                                {admin && <td>{student.studentId}</td>}
                                {admin && student.apprentice !== undefined && (
                                    <td className="flex justify-center">
                                        {student.apprentice ? (
                                            <FaCheck
                                                size={'5rem'}
                                                className="text-center text-green-500"
                                                onClick={() =>
                                                    handleChange(student, true)
                                                }
                                            />
                                        ) : (
                                            <FaTimes
                                                size={'5rem'}
                                                className="text-red-500"
                                                onClick={() =>
                                                    handleChange(student, false)
                                                }
                                            />
                                        )}
                                    </td>
                                )}
                                {admin && (
                                    <td>
                                        <FormattedTime
                                            milliseconds={student.duration}
                                        />
                                    </td>
                                )}
                                {admin && <td>{student.usageCount}</td>}
                                {admin && <td>{student.averageRating}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-4xl text-gray-500">
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
