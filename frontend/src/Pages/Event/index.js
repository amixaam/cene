import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import GetEventByID from "../../Database/API/GetEventByID";
import ConvertTime from "../../Reuse/Components/ConvertTime";

import StarsRating from "../../Reuse/Components/StarsRating";

export default function Event({ handleLoginPopup }) {
    const { e: event_id } = useParams();

    const { data, error, isLoading } = useQuery({
        queryKey: ["payment", "success", event_id],
        queryFn: () => {
            return GetEventByID(event_id);
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // return <div className="d"></div>;
    const { formattedStartTime, formattedEndTime } = ConvertTime(
        data["event"].time,
        data["event"].length
    );
    const formattedRange = `${formattedStartTime} - ${formattedEndTime}`;

    return (
        <div className="event-view-wrapper">
            <img src={data["event"].file_path} alt="" />
            <div className="info-wrapper">
                <div className="title-payment-wrapper">
                    <div className="title">
                        <h2>{data["event"].name}</h2>
                        <StarsRating rating={data["ratingAVG"]} />
                    </div>
                    <div className="payment">
                        <p>n seats available</p>
                        <button className="flex-button">From n €</button>
                    </div>
                </div>
                <div className="statistics-wrapper">
                    <p>Genre: {data["event"].genre.name}</p>
                    <p>
                        {data["event"].date} {formattedRange}
                    </p>
                    <p>Age rating: {data["event"].age_rating.name}</p>
                </div>
                <div className="description-wrapper">
                    {data["event"].description}
                </div>
            </div>
            <div className="seat-wrapper">
                
            </div>
        </div>
    );
}
