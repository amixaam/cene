import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import React from "react";
import GetGenres from "../../Database/API/GetGenres";

export default function Landing() {
    // Using the hook
    const dataQuery = useQuery({
        queryKey: ["test"],
        queryFn: GetGenres,
    });

    const handlePurchaseRedirect = async () => {
        const purchaseData = {
            event_id: 1,
            seats: [
                [1, 2],
                [4, 6],
            ],
        };
        const urlEndpoint = "http://127.0.0.1:8000/payments/checkout";

        try {
            const response = await axios.post(urlEndpoint, purchaseData);
            const checkoutUrl = response.data;

            // Redirect to the checkout URL
            window.location.href = checkoutUrl;
        } catch (error) {
            console.error("Error fetching checkout data:", error);
            // Handle the error, e.g., show an error message to the user
        }
    };

    // Error and Loading states
    if (dataQuery.isError) return <pre>{JSON.stringify(dataQuery.error)}</pre>;
    if (dataQuery.isLoading) return <div>Loading...</div>;

    return (
        <div>
            <i className="bi bi-sun-fill large-icon"></i>
            <i className="bi bi-moon-stars-fill"></i>

            <h1>Landing</h1>
            <button onClick={handlePurchaseRedirect}>
                Buy seats for Resident Castle II
            </button>

            {dataQuery.data.map((item) => (
                <div key={item.id}>
                    <img src={item.file_path} alt={item.name} />
                    <h1>{item.name}</h1>
                    <p>{item.description}</p>
                    <p>
                        {item.date}
                        <br />
                        {item.time}
                    </p>
                </div>
            ))}
        </div>
    );
}
