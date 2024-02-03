import { FaStar } from 'react-icons/fa';

interface DynamicStar {
    fill?: number;
    size?: number;
    [key: string]: any; // Allow for dynamic props
}

export const DynamicStar = ({ fill, size, ...props }: DynamicStar) => {
    const starFill = fill ? fill * 100 : 0;
    const starSize = size ? size : 30;

    return (
        <div className="relative" {...props}>
            <FaStar color="gray" size={size}/>
            <div
                className="absolute left-0 top-0 overflow-hidden"
                style={{ width: `${starFill}%` }}
            >
                <FaStar color={'gold'} size={size} />
            </div>
        </div>
    );
};

interface DynamicStaRatingrProps {
    averageRating: number;
}

const DynamicStarRating = ({ averageRating }: DynamicStaRatingrProps) => {
    const maxStars = 5;
    const starArray = [...Array(maxStars)].map((_, index) => {
        if (index < Math.floor(averageRating)) {
            return 1;
        } else if (
            index === Math.floor(averageRating) &&
            averageRating % 1 !== 0
        ) {
            return averageRating % 1;
        } else {
            return 0;
        }
    });

    return (
        <div className="flex flex-row space-x-[2rem]">
            {starArray.map((star, index) => (
                <DynamicStar key={index} fill={star} />
            ))}
        </div>
    );
};

export default DynamicStarRating;
