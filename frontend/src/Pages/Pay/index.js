import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import GetEventByID from "../../Database/API/GetEventByID";

import SeatingChart from "../../Reuse/Components/SeatingChart";

import "../../CSS/Event.scss";
import axios from "axios";
import NavPadding from "../../Reuse/Components/NavPadding";

export default function Pay() {
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loadingButton, setLoadingButton] = useState(false);
    const { e: event_id } = useParams();

    const { data, error, isLoading } = useQuery({
        queryKey: ["payment", "success", event_id],
        queryFn: () => {
            return GetEventByID(event_id);
        },
    });

    const calculateTotalPrice = () => {
        let total = 0;
        selectedSeats.forEach((seat) => {
            total += parseFloat(seat.price) || 0; // Convert the price to a number before adding
        });

        // Round to two decimal places
        const roundedTotal = Math.round(total * 100) / 100;
        setTotalPrice(roundedTotal);
    };

    const checkAuth = () => {
        if (!sessionStorage.getItem("token")) {
            navigate("/");
        }
    };
    useEffect(() => {
        checkAuth();
        calculateTotalPrice();
    }, [selectedSeats]);

    if (isLoading) {
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

    const handlePurchaseRedirect = async () => {
        setLoadingButton(true);
        const token = sessionStorage.getItem("token");
        const purchaseData = {
            event_id: data.event.id,
            seats: selectedSeats,
            total_price: totalPrice,
        };
        const urlEndpoint = "http://127.0.0.1:8000/api/payments/checkout";

        try {
            const response = await axios.post(urlEndpoint, purchaseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const checkoutUrl = response.data;

            // Redirect to the checkout URL
            setSelectedSeats([]);
            setLoadingButton(false);
            window.location.replace(checkoutUrl);
        } catch (error) {
            setLoadingButton(false);
            console.error("Error fetching checkout data:", error);
        }
    };

    return (
        <div className="event-view-wrapper">
            <img src={data["event"].file_path} alt="" />
            <div className="content-wrapper side-margins">
                <div className="seat-wrapper">
                    <h2>Seat Purchase</h2>
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
                        DisplayOnly={false}
                        selectedSeats={selectedSeats}
                        setSelectedSeats={setSelectedSeats}
                    />
                </div>
                <div className="payment-info-wrapper">
                    <div className="selected-seats">
                        <h3>Selected Seats</h3>
                        <div className="selected-types">
                            {selectedSeats.length > 0 ? (
                                selectedSeats.map((type) => (
                                    <div key={type.id} className="type">
                                        <div
                                            className={`square type-${getTicketTypeIdByName(
                                                type.name
                                            )}`}
                                        ></div>
                                        <p>
                                            row {type.row}, seat {type.col}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>no seats selected</p>
                            )}
                        </div>
                    </div>
                    <div className="pay">
                        <p>Powered with Stripe</p>
                        <button
                            className="flex-button"
                            disabled={selectedSeats.length === 0}
                            onClick={handlePurchaseRedirect}
                            aria-disabled={selectedSeats.length === 0}
                        >
                            {loadingButton ? (
                                <i className="bi bi-arrow-clockwise small-loading-anim"></i>
                            ) : (
                                `Pay ${totalPrice ? totalPrice + " €" : ""}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
