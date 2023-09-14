import { FaStar } from 'react-icons/fa';

interface DynamicStar {
    fill?: number;
}
const DynamicStar = ({ fill }: DynamicStar) => {
    const starFill = fill ? fill * 100 : 0;

    return (
        <div className="relative">
            <FaStar color="gray" />
            <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${starFill}%` }}
            >
                <FaStar color={'gold'} />
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
