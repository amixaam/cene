const StarForm = ({ rating, setRating }) => {
    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const renderStars = () => {
        const stars = Array.from({ length: 5 }, (_, index) => {
            const starClass = `bi bi-star${index + 1 <= rating ? "-fill" : ""}`;
            console.log(`Star ${index + 1} class:`, starClass);
            return (
                <i
                    key={index}
                    className={starClass}
                    onClick={() => handleStarClick(index + 1)}
                ></i>
            );
        });
        return stars;
    };

    return <div className="star-form">{renderStars()}</div>;
};

export default StarForm;
