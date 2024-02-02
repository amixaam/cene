import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import CancelPayment from "../../Database/API/CancelPayment";
import NavPadding from "../../Reuse/Components/NavPadding";

export default function Cancel() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const session_id = searchParams.get("session_id");

    const { data, error, isLoading } = useQuery({
        queryKey: ["payment", "cancel", session_id],
        queryFn: () => {
            return CancelPayment(session_id);
        },
    });

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

    if (error) {
        return (
            <div>
                <NavPadding />
                <main className="success-main">Error: {error.message}</main>
            </div>
        );
    }

    // Check for success response
    const isSuccess = data.data.success;

    if (isSuccess) {
        return (
            <div>
                <NavPadding />
                <main className="success-main">
                    <h1>Payment Cancelled!</h1>
                    <p>Hope to see you next time!</p>
                    <Link to="/profile" className="flex-button">
                        View Purchases
                    </Link>
                </main>
            </div>
        );
    }
    return (
        <div>
            <NavPadding />
            <main className="success-main">
                <h2>{data.data.error}</h2>
            </main>
        </div>
    );
}
