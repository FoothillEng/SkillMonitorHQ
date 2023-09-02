import Image from 'next/image';
import { User } from '@prisma/client';

const Student = (student: User) => {
    return (
        <div className="flex flex-row items-center justify-center space-x-[5rem] text-purple-400">
            <Image
                src={`data:image/png;base64,${student.avatar}`}
                alt="avatar"
                width={100}
                height={100}
                className="rounded-full mt-4"
            />
            <h1 className="text-6xl">
                {student.firstName} {student.lastName}
            </h1>
            <h2 className="text-3xl"> {student.studentId} </h2>
        </div>
    );
};

export default Student;
