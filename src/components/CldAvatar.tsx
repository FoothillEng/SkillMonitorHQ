import { CldImage } from 'next-cloudinary';
import { type StudentLevel } from '@prisma/client';

const studentAvatarClass = (level: StudentLevel, width: string) => {
    const classes = `rounded-full outline ${
        level === 'BEGINNER'
            ? 'outline-purple-500'
            : level === 'INTERMEDIATE'
            ? 'outline-yellow-500'
            : 'outline-blue-500'
    } ${
        width === 'SMALL'
            ? 'outline-4'
            : width === 'MEDIUM'
            ? 'outline-8'
            : 'outline-[1.5rem]'
    }`;
    return classes;
};

interface CldAvatarProps {
    avatar: string;
    level: StudentLevel;
    size: 'SMALL' | 'MEDIUM' | 'LARGE';
}

const sizeMap = {
    SMALL: [50, 50],
    MEDIUM: [100, 100],
    LARGE: [300, 300]
};

const CldAvatar = ({ avatar, level, size }: CldAvatarProps) => {
    return (
        <CldImage
            width={sizeMap[size][0]}
            height={sizeMap[size][1]}
            // sizes="100vw" ??
            src={avatar}
            rawTransformations={[
                'c_crop,g_face/c_scale,w_200,h_200/r_max/e_grayscale/f_auto'
            ]}
            className={studentAvatarClass(level, size)}
            alt="pfp"
        />
    );
};

export default CldAvatar;
