import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import CancelPayment from "../../Database/API/CancelPayment";

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
                <h1>Canceled</h1>
            </div>
        );
    }
    return (
        <div>
            <h1>{data.data.error}</h1>
        </div>
    );
}
