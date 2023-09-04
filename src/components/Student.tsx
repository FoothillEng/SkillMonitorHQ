import { CldImage } from 'next-cloudinary';

import { User } from '@prisma/client';

const Student = (student: User) => {
    return (
        <div className="flex flex-row items-center justify-center space-x-[2rem] text-green">
            {student && student.avatar && (
                <CldImage
                    width="50"
                    height="50"
                    sizes="100vw"
                    src={student.avatar}
                    rawTransformations={[
                        'c_crop,g_face/c_scale,w_200,h_200/r_max/e_grayscale/f_auto'
                    ]}
                    alt="pfp"
                />
            )}

            <h1 className="text-3xl capitalize">
                {student.firstName} {student.lastName}
            </h1>
            <h2 className="text-3xl"> {student.studentId} </h2>
        </div>
    );
};

export default Student;
