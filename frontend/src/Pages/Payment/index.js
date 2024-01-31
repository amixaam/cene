import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import ConfirmPayment from "../../Database/API/ConfirmPayment";
import NavPadding from "../../Reuse/Components/NavPadding";

import "../../CSS/Success.scss";

export default function SuccessPayment() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const session_id = searchParams.get("session_id");

    const { data, error, isLoading } = useQuery({
        queryKey: ["payment", "success", session_id],
        queryFn: () => {
            return ConfirmPayment(session_id);
        },
    });

    if (isLoading) {
        return (
            <div>
                <NavPadding />
                <main className="success-main">
                    <p>Loading...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <NavPadding />
                <main className="success-main">
                    <p>Error: {error.message}</p>
                </main>
            </div>
        );
    }

    return (
        <div>
            <NavPadding />
            <main className="success-main">
                <h1>Payment successful!</h1>
                <p>Thank you for your purchase!</p>
                <Link to="/profile" className="flex-button">
                    View Purchases
                </Link>
            </main>
        </div>
    );
}
