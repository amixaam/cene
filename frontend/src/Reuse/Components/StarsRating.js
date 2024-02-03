const StarsRating = ({ rating, avg = false }) => {
    if (!rating || rating.length === 0) return "No rating";

    if (!avg) {
        const filledStars = Array.from(
            { length: Math.floor(rating) },
            (_, index) => <i className="bi bi-star-fill" key={index}></i>
        );

        const remainingStars = Array.from(
            { length: Math.floor(5 - rating) },
            (_, index) => <i className="bi bi-star" key={index}></i>
        );

        return (
            <div className="stars-wrapper">
                {filledStars}
                {remainingStars}
            </div>
        );
    } else {
        const ratings = rating.map((review) => review.rating);

        // Calculate the average rating
        const averageRating =
            ratings.length > 0
                ? ratings.reduce((a, b) => a + b) / ratings.length
                : 0;

        // Round the average rating to the nearest integer
        const roundedRating = Math.round(averageRating);

        // Calculate the number of filled stars
        const filledStars = Array.from(
            { length: roundedRating },
            (_, index) => <i className="bi bi-star-fill" key={index}></i>
        );

        // Calculate the number of remaining stars (out of 5)
        const remainingStars = Array.from(
            { length: 5 - roundedRating },
            (_, index) => <i className="bi bi-star" key={index}></i>
        );

        // Display the stars
        return (
            <div className="stars-wrapper">
                {filledStars}
                {remainingStars}
            </div>
        );
    }
};

export default StarsRating;
