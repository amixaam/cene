import { useQuery } from "@tanstack/react-query";
import React from "react";
import GetTicketData from "../../Database/API/GetTicketData";
import axios from "axios";

export default function Payments() {
    const {
        data: paymentData,
        error: paymentError,
        isLoading: paymentisLoading,
    } = useQuery({
        queryKey: ["payments", "history"],
        queryFn: GetTicketData,
    });

    const handlePDFDownload = async (data) => {
        const token = sessionStorage.getItem("token");

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/payments/generatePDF",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/pdf",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "ticket.pdf");
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            } else {
                console.error(
                    "Failed to fetch PDF:",
                    response.status,
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    };

    if (paymentisLoading) {
        return (
            <p className="loading-screen">
                <i className="bi bi-arrow-clockwise"></i>
            </p>
        );
    }
    if (paymentError || !paymentData.data || paymentData.data.length === 0) {
        return <p className="loading-screen">No Payments made.</p>;
    }

    return (
        <>
            <h3>Payments</h3>
            {paymentData.data.map((payment, index) => (
                <div className="payment-wrapper" key={index.id}>
                    <h1>
                        {payment.event.name} • {payment.amount}€
                    </h1>
                    <button
                        className="flex-button"
                        onClick={() => {
                            handlePDFDownload(payment);
                        }}
                    >
                        Download PDF
                    </button>
                </div>
            ))}
        </>
    );
}
