import React from "react";

import "../../CSS/EventCard.scss";

import { Link } from "react-router-dom";

export default function EventCard({ data, handleEventRedirect }) {
    const startTime = new Date(`01/01/2022 ${data.time}`);
    const endTime = new Date(startTime.getTime() + data.length * 60000);

    // Format start and end times
    const formattedStartTime = startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    const formattedEndTime = endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const maxLength = 120;
    const truncatedDescription =
        data.description.length > maxLength
            ? `${data.description.slice(0, maxLength)}...`
            : data.description;

    // Combine formatted times into a new variable
    const formattedRange = `${formattedStartTime} - ${formattedEndTime}`;
    return (
        <Link className="event-card-wrapper" to={`/event/${data.id}`}>
            <div
                className="card-image"
                style={{
                    background: `linear-gradient(180deg, rgba(26, 9, 0, 0.00) 52.1%, #1A0900 100%), 
                    linear-gradient(0deg, rgba(26, 9, 0, 0.35) 0%, rgba(26, 9, 0, 0.35) 100%), 
                    url(${data.file_path})`,
                    backgroundSize: "cover",
                }}
            ></div>
            <div className="card-content">
                <div className="title-wrapper">
                    <h3>{data.name}</h3>
                    <p>
                        {data.regular_ticket_price}€ · {data.date} ·{" "}
                        {formattedRange}
                    </p>
                </div>
                <p>{truncatedDescription}</p>
            </div>
        </Link>
    );
}
