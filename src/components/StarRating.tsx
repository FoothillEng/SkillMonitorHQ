import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
    currentUserId: String;
    userLoginId: number;
    handleStarRatingClick: () => void;
    setError: (error: string) => void;
}

const StarRating = ({
    currentUserId,
    userLoginId,
    handleStarRatingClick,
    setError
}: StarRatingProps) => {
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
        <div className="flex flex-row space-x-[2rem]">
            <div className="text-5xl">
                <p>Rate the cleanliness of the last user</p>
            </div>
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    color={'gold'}
                    size={50}
                    style={{ cursor: 'pointer' }}
                />
            ))}
        </div>
    );
};

export default StarRating;
