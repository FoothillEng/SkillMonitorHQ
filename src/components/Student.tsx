import { CldImage } from 'next-cloudinary';

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

    const ImageDimensions = col ? [100, 100] : [50, 50];

    return (
        <div
            className={`flex ${
                col ? 'flex-col' : 'flex-row'
            } items-center space-x-[2rem]`}
        >
            {student && student.avatar && (
                <CldImage
                    width={ImageDimensions[0]}
                    height={ImageDimensions[1]}
                    sizes="100vw"
                    src={student.avatar}
                    rawTransformations={[
                        'c_crop,g_face/c_scale,w_200,h_200/r_max/e_grayscale/f_auto'
                    ]}
                    alt="pfp"
                />
            )}

            <h1 className="text-3xl capitalize">
                {firstName}
                {lastName && ` ${lastName}${truncated ? '.' : ''} `}
            </h1>
            {viewId && <h2 className="text-3xl"> {student.studentId} </h2>}
        </div>
    );
};

export default Student;
