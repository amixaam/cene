const StarsRating = ({ rating }) => {
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
};

export default StarsRating;
