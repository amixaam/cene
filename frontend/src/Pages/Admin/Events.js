import React from "react";
import StarsRating from "../../Reuse/Components/StarsRating";
import { Link, useNavigate } from "react-router-dom";

export default function Events({ eventsData }) {
    const navigate = useNavigate();
    return (
        <>
            <h2>Events</h2>
            {eventsData.map((event) => (
                <div className="event-container" key={event.id}>
                    <div
                        className="left-side"
                        onClick={() => {
                            navigate(`/event/${event.id}`);
                        }}
                    >
                        <img src={event.file_path} alt="" />
                        <div className="title-wrapper">
                            <h3>{event.name}</h3>
                            <StarsRating rating={event.reviews} avg={true} />
                        </div>
                    </div>
                    <div className="right-side">
                        <Link
                            to={`edit/${event.id}`}
                            className="flex-button-orange"
                        >
                            Edit & Statistics
                        </Link>
                    </div>
                </div>
            ))}
        </>
    );
}
