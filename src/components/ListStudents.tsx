import { useEffect, useState } from 'react';
import { User } from '@prisma/client';

import { CldImage } from 'next-cloudinary';

import { FaCheck, FaTimes } from 'react-icons/fa';

import Student from '@/components/Student';

interface ListStudentsProps {
    fetchUrl: string;
    viewId: boolean;
    style?: string;
}

type StudentWithPartialUMI = User & {
    apprentice: boolean;
    userMachineId: number;
};

const ListStudents = ({ fetchUrl, viewId, style }: ListStudentsProps) => {
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
                        <tr>
                            <th>Avatar</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Apprentice</th>
                        </tr>
                    </thead>
                    <tbody className="text-3xl capitalize">
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className="flex justify-center">
                                    <CldImage
                                        width={50}
                                        height={50}
                                        sizes="100vw"
                                        src={student.avatar}
                                        rawTransformations={[
                                            'c_crop,g_face/c_scale,w_200,h_200/r_max/e_grayscale/f_auto'
                                        ]}
                                        alt="pfp"
                                    />
                                </td>
                                <td> {student.firstName}</td>
                                <td> {student.lastName}</td>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
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
