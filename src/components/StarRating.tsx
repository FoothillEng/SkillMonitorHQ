import { useState, useEffect } from 'react';
import { DynamicStar } from './DynamicStarRating';

interface StarRatingProps {
    currentUserId: String;
    userLoginId: number;
    handleStarRatingClick: () => void;
    setError: (error: string) => void;
}

const OSCILLATION_DEFAULT = [0,0, 0, 0, 0] as number[];

const StarRating = ({
    currentUserId,
    userLoginId,
    handleStarRatingClick,
    setError
}: StarRatingProps) => {
    const [rating, setRating] = useState(OSCILLATION_DEFAULT);
    const [index, setIndex] = useState(0);

    useEffect(() => { // oscillate the stars
        const interval = setInterval(() => {
            if (index < 3) {
                setRating((prevRating) => {
                    const newRating = [...prevRating];
                    newRating[index] = 1;
                    return newRating;
                });
                setIndex(index + 1);
            } else if (index < 5) {
                setRating((prevRating) => {
                    const newRating = [...prevRating];
                    newRating[index] = 1;
                    newRating[index-3] = 0;
                    return newRating;
                });
                setIndex(index + 1);
            } else if (index < 9) {
                setRating((prevRating) => {
                    const newRating = [...prevRating];
                    newRating[index - 4] = 0;
                    return newRating;
                });
                setIndex(index + 1);
            }else {
                clearInterval(interval);
                setTimeout(() => {
                    setRating(OSCILLATION_DEFAULT);
                    setIndex(0);
                }, 1000);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [index]);

    const handleRatingClick = async (clickedRating: number) => {
        try {
            // Send an API request to record the rating
            await fetch('/api/updateRating', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentUserId,
                    userLoginId,
                    rating: clickedRating
                })
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(res.status.toString());
                    }
                })
                .then(() => {
                    handleStarRatingClick();
                });
        } catch (error) {
            console.error('Error while recording rating:', error);
            setError('Error while recording rating');
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="text-fhs-blue text-6xl mb-[10rem]">
                Rate the cleanliness of the last user
            </div>
            <div className='flex flex-row space-x-[5rem]'>
            {rating.map((star, idx) => (
                <DynamicStar
                    key={idx}
                    fill={star}
                    size={50}
                    onClick={() => handleRatingClick(idx+1)}
                />
            ))}
            </div>
        </div>
    );
};

export default StarRating;
