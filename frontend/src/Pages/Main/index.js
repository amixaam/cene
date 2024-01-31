import { useQuery } from "@tanstack/react-query";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../../CSS/Main.scss";
import HeroImage from "../../Images/Images/Hero.svg";

import GetEvents from "../../Database/API/GetEvents";
import GetRandomReview from "../../Database/API/GetRandomReview";

import EventCard from "../../Reuse/Components/EventCard";
import ReviewCard from "../../Reuse/Components/ReviewCard";

export default function Landing() {
    // Using the hook
    const {
        data: eventData,
        error: eventError,
        isLoading: eventisLoading,
    } = useQuery({
        queryKey: ["events"],
        queryFn: GetEvents,
    });

    const {
        data: reviewData,
        error: reviewError,
        isLoading: reviewisLoading,
    } = useQuery({
        queryKey: ["reviews"],
        queryFn: GetRandomReview,
    });

    const handlePurchaseRedirect = async () => {
        const token = sessionStorage.getItem("token");
        const purchaseData = {
            event_id: 1,
            seats: [
                [1, 2],
                [4, 6],
            ],
        };
        const urlEndpoint = "http://127.0.0.1:8000/api/payments/checkout";

        try {
            const response = await axios.post(urlEndpoint, purchaseData, {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json", // Adjust content type as needed
                },
            });
            const checkoutUrl = response.data;

            // Redirect to the checkout URL
            console.log(checkoutUrl);
            window.location.replace(checkoutUrl);
        } catch (error) {
            console.error("Error fetching checkout data:", error);
            // Handle the error, e.g., show an error message to the user
        }
    };

    const handleEventRedirect = (event_id) => {
        window.location.href = `/event?e=${event_id}`;
    };

    // Error and Loading states
    if (eventError) return <pre>{JSON.stringify(eventData.error)}</pre>;
    if (reviewError) return <pre>{JSON.stringify(reviewError.error)}</pre>;

    return (
        <div className="page-wrapper">
            <header className="hero-wrapper">
                <img src={HeroImage} alt="" />
                <div className="side-margins hero-content">
                    <div className="title-content">
                        <h1>CENE</h1>
                        <p>The one-stop-shop for tickets in Latvia.</p>
                    </div>
                </div>
            </header>
            <main className="main-content-wrapper side-margins">
                <section className="upcoming-events-wrapper">
                    <h2>Upcoming Events</h2>
                    <div className="events-wrapper">
                        {eventisLoading ? (
                            <div className="error">Loading...</div>
                        ) : (
                            eventData.map((item) => (
                                <EventCard
                                    data={item}
                                    handleEventRedirect={handleEventRedirect}
                                    key={item.id}
                                />
                            ))
                        )}
                    </div>
                    <div className="button-wrapper">
                        <Link className="flex-button" to="events">
                            View All Events
                        </Link>
                    </div>
                </section>
                <section className="review-wrapper">
                    {reviewisLoading ? (
                        <div className="error">Loading...</div>
                    ) : (
                        <>
                            <h2>A review from {reviewData.event.name}</h2>
                            <ReviewCard data={reviewData} />
                            <div className="button-wrapper">
                                <Link
                                    className="flex-button"
                                    to={`event/${reviewData.event.id}`}
                                >
                                    More Reviews
                                </Link>
                            </div>
                        </>
                    )}
                </section>
                <section className="call-to-action-wrapper">
                    <img src="" alt="" className="background" />
                    <div className="content-wrapper">
                        <h1>MOMENTS</h1>
                        <p>That you're gonna enjoy.</p>
                        <button className="flex-button-white">Sign up</button>
                    </div>
                </section>
            </main>
        </div>
    );
}
