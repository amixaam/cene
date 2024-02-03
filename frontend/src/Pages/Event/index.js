import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import GetEventByID from "../../Database/API/GetEventByID";

import ConvertTime from "../../Reuse/Components/ConvertTime";
import StarsRating from "../../Reuse/Components/StarsRating";
import SeatingChart from "../../Reuse/Components/SeatingChart";

import "../../CSS/Event.scss";
import NavPadding from "../../Reuse/Components/NavPadding";
import GetReviews from "../../Database/API/GetReviews";

export default function Event({ handleLoginPopup }) {
    const { e: event_id } = useParams();

    const [isInputActive, setInputActive] = useState(false);

    const { data, error, isLoading } = useQuery({
        queryKey: ["payment", "success", event_id],
        queryFn: () => {
            return GetEventByID(event_id);
        },
    });

    const {
        data: reviewData,
        error: reviewError,
        isLoading: reviewisLoading,
    } = useQuery({
        queryKey: ["refiews"],
        queryFn: GetReviews,
    });

    if (isLoading || reviewisLoading) {
        return (
            <div>
                <NavPadding />
                <main className="success-main">
                    <i className="bi bi-arrow-clockwise loading-anim"></i>
                </main>
            </div>
        );
    }
    console.log(reviewData);
    const getTicketTypeIdByName = (name) => {
        // Sort ticketTypes by price in ascending order
        const sortedTicketTypes = [...data.ticketTypes].sort(
            (a, b) => a.price - b.price
        );

        // Assign IDs from 1 to 4
        const ticketTypesWithIds = sortedTicketTypes.map((type, index) => ({
            ...type,
            id: index + 1,
        }));

        // Find the ID by name
        const foundType = ticketTypesWithIds.find((type) => type.name === name);

        // Return the ID if found, otherwise return null
        return foundType ? foundType.id : null;
    };

    // return <div className="d"></div>;
    const { formattedStartTime, formattedEndTime } = ConvertTime(
        data["event"].time,
        data["event"].length
    );
    const formattedRange = `${formattedStartTime} - ${formattedEndTime}`;

    const lowestPrice = Math.min(...data.ticketTypes.map((type) => type.price));
    return (
        <div className="event-view-wrapper">
            <img src={data["event"].file_path} alt="" />
            <div className="content-wrapper side-margins">
                <div className="info-wrapper">
                    <div className="title-payment-wrapper">
                        <div className="title">
                            <h2>{data["event"].name}</h2>
                            <StarsRating rating={data["ratingAVG"]} />
                        </div>
                        <div className="payment">
                            <p>{data.freeSeats} seats available</p>
                            {sessionStorage.getItem("token") ? (
                                <Link
                                    to={`/Pay/${data["event"].id}`}
                                    className="flex-button"
                                >
                                    From {lowestPrice} €
                                </Link>
                            ) : (
                                <button
                                    className="flex-button"
                                    onClick={handleLoginPopup}
                                >
                                    Log in to buy
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="statistics-wrapper">
                        <p>Genre: {data["event"].genre.name}</p>
                        <div className="divider"></div>
                        <p>
                            {data["event"].date} • {formattedRange}
                        </p>
                        <div className="divider"></div>
                        <p>Age rating: {data["event"].age_rating.name}</p>
                    </div>
                    <div className="description-wrapper">
                        {data["event"].description}
                    </div>
                </div>
                <div className="seat-wrapper">
                    <h2>Seat information</h2>
                    <div className="type-wrapper">
                        <div className="type">
                            <div className={`square type-5`}></div>
                            <p>Taken</p>
                        </div>
                        {data.ticketTypes.map((type) => (
                            <div key={type.id} className="type">
                                <div
                                    className={`square type-${getTicketTypeIdByName(
                                        type.name
                                    )}`}
                                ></div>
                                <p>{type.name}</p>
                                <p>{type.price} €</p>
                            </div>
                        ))}
                    </div>
                    <SeatingChart
                        seatsData={data.seats}
                        maxCols={data.event.max_cols}
                        ticketTypes={data.ticketTypes}
                        DisplayOnly={true}
                    />
                </div>
                <div className="review-wrapper">
                    <h2>Reviews</h2>
                    <div
                        className="create-review-form"
                        onFocus={() => {
                            setInputActive(true);
                        }}
                        onBlur={() => {
                            setInputActive(false);
                        }}
                    >
                        <input type="text" placeholder="Leave your review..." />
                        <div
                            className={`hidden-review ${
                                isInputActive ? "form-active" : ""
                            }`}
                        >
                            <div>
                                <input
                                    type="text"
                                    className="title-input"
                                    placeholder="Title"
                                />
                                <div className="star-form">
                                    <i className="bi bi-star"></i>
                                    <i className="bi bi-star"></i>
                                    <i className="bi bi-star"></i>
                                    <i className="bi bi-star"></i>
                                    <i className="bi bi-star"></i>
                                </div>
                                <button className="flex-button-review">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                    {reviewData.map((review) => {
                        return (
                            <div
                                key={review.id}
                                className="event-review-container"
                            >
                                <div className="review-title">
                                    <h3>{review.user.name}</h3>
                                    <StarsRating rating={review.rating} />
                                </div>
                                <p>{review.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
