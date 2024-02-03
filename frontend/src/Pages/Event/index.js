import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import GetEventByID from "../../Database/API/GetEventByID";
import Get from "../../Database/API/Get";
import Post from "../../Database/API/Post";
import Delete from "../../Database/API/Delete";

import ConvertTime from "../../Reuse/Components/ConvertTime";
import StarsRating from "../../Reuse/Components/StarsRating";
import SeatingChart from "../../Reuse/Components/SeatingChart";

import "../../CSS/Event.scss";
import NavPadding from "../../Reuse/Components/NavPadding";
import StarForm from "../../Reuse/Components/StarForm";

export default function Event({ handleLoginPopup }) {
    const { e: event_id } = useParams();

    const [isInputActive, setInputActive] = useState(false);
    const [rating, setRating] = useState(0);
    const [title, settitle] = useState("");
    const [description, setdescription] = useState("");
    const [deleteButtonLoading, setdeleteButtonLoading] = useState(null);

    const { data, error, isLoading } = useQuery({
        queryKey: ["event", "data", event_id],
        queryFn: () => {
            return GetEventByID(event_id);
        },
    });

    const {
        data: reviewData,
        error: reviewError,
        isLoading: reviewisLoading,
        refetch: reviewRefetch,
    } = useQuery({
        queryKey: ["reviews", "event"],
        queryFn: async () => {
            return await Get(`reviews/${event_id}`);
        },
    });

    const {
        data: validateReviewData,
        error: validateReviewError,
        isLoading: validateReviewisLoading,
    } = useQuery({
        queryKey: ["reviews", "validate"],
        queryFn: async () => {
            const token = sessionStorage.getItem("token");
            return await Post(`reviews/validate`, token, {
                event_id: event_id,
            });
        },
    });

    if (isLoading || reviewisLoading || validateReviewisLoading) {
        return (
            <div>
                <NavPadding />
                <main className="success-main">
                    <i className="bi bi-arrow-clockwise loading-anim"></i>
                </main>
            </div>
        );
    }
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

    const handleCreateReview = async () => {
        const token = sessionStorage.getItem("token");
        const data = {
            event_id: event_id,
            title: title,
            description: description,
            rating: rating,
        };
        const response = Post("reviews/", token, data);
        setInputActive(false);
        settitle("");
        setdescription("");
        setRating(0);
        await reviewRefetch();
    };

    const deleteReview = async (id) => {
        setdeleteButtonLoading(id);
        const token = sessionStorage.getItem("token");
        const response = Delete(`reviews`, token, id);
        await reviewRefetch();
        setdeleteButtonLoading(null);
    };

    const handleTitleChange = (e) => {
        settitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setdescription(e.target.value);
    };
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
                        <p>
                            Genre:{" "}
                            {data["event"].genre
                                ? data["event"].genre.name
                                : "None"}
                        </p>
                        <div className="divider"></div>
                        <p>
                            {data["event"].date} • {formattedRange}
                        </p>
                        <div className="divider"></div>
                        <p>
                            Age rating:{" "}
                            {data["event"].age_rating
                                ? data["event"].age_rating.name
                                : "None"}
                        </p>
                    </div>
                    <div className="description-wrapper">
                        {data["event"].description}
                    </div>
                </div>
                <div className="image-wrapper">
                    <h2>Images & Trailers</h2>
                    <img
                        className="image"
                        src={data["event"].file_path}
                        alt=""
                    />
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
                    {validateReviewData.message ? (
                        <div
                            className="create-review-form"
                            onFocus={() => {
                                setInputActive(true);
                            }}
                        >
                            <input
                                type="text"
                                value={description}
                                onChange={handleDescriptionChange}
                                placeholder="Leave your review..."
                            />
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
                                        value={title}
                                        onChange={handleTitleChange}
                                    />
                                    <StarForm
                                        rating={rating}
                                        setRating={setRating}
                                    />
                                    <button
                                        className={`flex-button-review ${
                                            title && rating && description
                                                ? ""
                                                : "disabled"
                                        }`}
                                        disabled={
                                            title && rating && description
                                                ? ""
                                                : "true"
                                        }
                                        onClick={handleCreateReview}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        "Log in and purchase tickets to add reviews!"
                    )}

                    <div className="no-reviews">
                        {reviewData.length === 0
                            ? "No comments yet, be the first!"
                            : ""}
                    </div>
                    {reviewData.map((review) => {
                        return (
                            <div
                                key={review.id}
                                className="event-review-container"
                            >
                                <div className="review-top">
                                    <div className="review-title">
                                        <h3>{review.title}</h3>
                                        <StarsRating rating={review.rating} />
                                    </div>
                                    <div>
                                        {review.user_id ==
                                        sessionStorage.getItem("user_id") ? (
                                            <button
                                                className="flex-button-orange"
                                                onClick={() => {
                                                    deleteReview(review.id);
                                                }}
                                            >
                                                {deleteButtonLoading ===
                                                review.id ? (
                                                    <i className="bi bi-arrow-clockwise small-loading-anim"></i>
                                                ) : (
                                                    "X"
                                                )}
                                            </button>
                                        ) : (
                                            ""
                                        )}
                                    </div>
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
