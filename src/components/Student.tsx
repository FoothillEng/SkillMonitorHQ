import CldAvatar from '@/components/CldAvatar';

import { User } from '@prisma/client';

interface StudentProps {
    student: User;
    viewId: boolean;
    col: boolean;
}

const Student = ({ student, viewId, col }: StudentProps) => {
    const firstName = col
        ? student.firstName.substring(0, 15)
        : student.firstName;
    const lastName = col
        ? student.lastName.substring(0, 15 - firstName.length)
        : student.lastName;
    const truncated = firstName.length + lastName.length > 15;

    const ImageDimensions = col ? 'MEDIUM' : 'SMALL';

    return (
        <div
            className={`flex ${
                col ? 'flex-col' : 'flex-row'
            } items-center space-x-[2rem]`}
        >
            {student && student.avatar && (
                <CldAvatar
                    avatar={student.avatar}
                    level={student.level}
                    size={ImageDimensions}
                />
            )}

            <h1 className="mt-[1rem] text-3xl capitalize">
                {firstName}
                {lastName && ` ${lastName}${truncated ? '.' : ''} `}
            </h1>
            {viewId && <h2 className="text-3xl"> {student.studentId} </h2>}
        </div>
    );
};

export default Student;
