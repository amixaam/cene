import React from "react";

import "../../CSS/ReviewCard.scss";
import StarsRating from "./StarsRating";

export default function ReviewCard({ data }) {
    return (
        <div className="review-card-wrapper">
            <img src={data.event.file_path} alt="" className="image" />
            <div className="content-wrapper">
                <div className="title-wrapper">
                    <h3>{data.title}</h3>
                    <StarsRating rating={data.rating} />
                </div>
                <p>{data.description}</p>
            </div>
        </div>
    );
}
