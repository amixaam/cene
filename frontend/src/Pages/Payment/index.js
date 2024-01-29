import React from "react";
import { useQuery } from "@tanstack/react-query";
import { json, useLocation } from "react-router-dom";
import ConfirmPayment from "../../Database/API/ConfirmPayment";

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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Check for success response
    const isSuccess = data.data.success;

    if (isSuccess) {
        return (
            <div>
                <h1>Payment successful!</h1>
            </div>
        );
    }
    return (
        <div>
            <h1>{data.data.error}</h1>
        </div>
    );
}