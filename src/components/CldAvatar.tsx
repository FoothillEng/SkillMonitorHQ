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
        width === 'small' || width === 'medium'
            ? 'outline-[.5rem]'
            : width === 'large'
              ? 'outline-[1rem]'
              : 'outline-[1.5rem]'
    }`;
    return classes;
};

interface CldAvatarProps {
    avatar: string;
    level: StudentLevel;
    size: 'small' | 'medium' | 'large' | 'extraLarge';
}

const sizeMap = {
    small: [50, 50],
    medium: [100, 100],
    large: [200, 200],
    extraLarge: [300, 300]
};

const CldAvatar = ({ avatar, level, size }: CldAvatarProps) => {
    return (
        <CldImage
            width={sizeMap[size][0]}
            height={sizeMap[size][1]}
            // sizes="100vw" ??
            src={avatar}
            rawTransformations={[
                'c_crop,g_face/c_scale,w_200,h_200/r_max/f_auto'
            ]}
            className={studentAvatarClass(level, size)}
            alt="pfp"
        />
    );
};

export default CldAvatar;
