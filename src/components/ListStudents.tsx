import { useEffect, useState } from 'react';
import { type User } from '@prisma/client';

import { FaCheck, FaTimes } from 'react-icons/fa';

import FormattedTime from '@/components/FormattedTime';
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

    const avatarVariants: { [key: number]: string } = {
        0: '',
        1: 'opacity-50 ml-[3rem]',
        2: 'opacity-25 ml-[3rem]'
    };

    return (
        <div>
            {students && students.length > 0 ? (
                <div>
                    {admin ? (
                        <table className="border-separate border-spacing-[3rem] text-center">
                            <thead className="text-6xl text-secondary-500 md:text-5xl">
                                {students[0].usageCount !== undefined && (
                                    <tr>
                                        <th>Avatar</th>
                                        <th>Name</th>
                                        {/* <th>Student ID</th> */}
                                        <th>Apprentice</th>
                                        <th>Time</th>
                                        <th>Usage #</th>
                                        <th>Avg. Rating</th>
                                    </tr>
                                )}
                                {students[0].usageCount === undefined && ( // whats this for lol
                                    <tr>
                                        <th>Avatar</th>
                                        <th>Name</th>
                                        {/* <th>Student ID</th> */}
                                        <th>Time on all machines</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="text-5xl capitalize md:text-4xl">
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td className="flex justify-center">
                                            <CldAvatar
                                                avatar={student.avatar}
                                                level={student.level}
                                                size={'medium'}
                                            />
                                        </td>
                                        <td>
                                            {' '}
                                            {student.firstName}{' '}
                                            {(
                                                student.lastName as string
                                            ).charAt(0)}
                                            .
                                        </td>
                                        {/* {<td>{student.studentId}</td>} */}
                                        {student.apprentice !== undefined && (
                                            <td className="flex justify-center">
                                                {student.apprentice ? (
                                                    <FaCheck
                                                        size={'5rem'}
                                                        className="text-center text-green"
                                                        onClick={() =>
                                                            handleChange(
                                                                student,
                                                                true
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <FaTimes
                                                        size={'5rem'}
                                                        className="text-red-500"
                                                        onClick={() =>
                                                            handleChange(
                                                                student,
                                                                false
                                                            )
                                                        }
                                                    />
                                                )}
                                            </td>
                                        )}
                                        {
                                            <td>
                                                <FormattedTime
                                                    milliseconds={
                                                        student.duration
                                                    }
                                                />
                                            </td>
                                        }
                                        {<td>{student.usageCount}</td>}
                                        {<td>{student.averageRating}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-row">
                            {students.map((student, idx) => (
                                <div key={student.id}>
                                    <div
                                        className={`flex ${avatarVariants[idx]}`}
                                    >
                                        <CldAvatar
                                            avatar={student.avatar}
                                            level={student.level}
                                            size={'large'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
