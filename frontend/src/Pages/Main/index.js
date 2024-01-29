import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import "./index.scss";

import React from "react";
import GetGenres from "../../Database/API/GetGenres";

export default function Landing() {
    sessionStorage.setItem(
        "token",
        "Bearer 2|SrhxbaK79vsVfC7RqqFGGi2w43H4lKU3allEf2PX4ba0bf78"
    );
    // Using the hook
    const dataQuery = useQuery({
        queryKey: ["test"],
        queryFn: GetGenres,
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
