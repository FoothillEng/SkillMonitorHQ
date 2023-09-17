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

type StudentWithApprentice = User & { apprentice: boolean };
const ListStudents = ({ fetchUrl, viewId, style }: ListStudentsProps) => {
    const [students, setStudents] = useState<StudentWithApprentice[]>([]);
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
                                        />
                                    ) : (
                                        <FaTimes
                                            size={'5rem'}
                                            className="text-red-500"
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
