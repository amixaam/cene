import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import ConfirmPayment from "../../../Database/API/ConfirmPayment";

export default function SuccessPayment() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const session_id = searchParams.get("session_id");

    console.log(session_id);

    const { data, error, isLoading } = useQuery({
        queryKey: ["payment", "success", session_id],
        queryFn: () => ConfirmPayment(session_id),
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>SuccessPayment</h2>
            <pre>{JSON.stringify(data)}</pre>
        </div>
    );
}
