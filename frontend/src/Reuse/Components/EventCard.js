import React from "react";

import "../../CSS/EventCard.scss";

import { Link } from "react-router-dom";

import ConvertTime from "./ConvertTime";

export default function EventCard({ data, handleEventRedirect }) {
    const maxLength = 120;
    const truncatedDescription =
        data.description.length > maxLength
            ? `${data.description.slice(0, maxLength)}...`
            : data.description;

    // Combine formatted times into a new variable
    const { formattedStartTime, formattedEndTime } = ConvertTime(
        data.time,
        data.length
    );
    const formattedRange = `${formattedStartTime} - ${formattedEndTime}`;
    return (
        <Link className="event-card-wrapper" to={`/event/${data.id}`}>
            <div
                className="card-image"
                style={{
                    background: `var(--card-gradient), 
                    url(${data.file_path})`,
                    backgroundSize: "cover",
                }}
            ></div>
            <div className="card-content">
                <div className="title-wrapper">
                    <h3>{data.name}</h3>
                    <p>
                        {data.date} · {formattedRange}
                    </p>
                </div>
                <p>{truncatedDescription}</p>
            </div>
        </Link>
    );
}
