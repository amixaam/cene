import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import GetEvents from "../../Database/API/GetEvents";
import EventCard from "../../Reuse/Components/EventCard";

export default function Event() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const event_id = searchParams.get("e");

    const { data, error, isLoading } = useQuery({
        queryKey: ["payment", "success", event_id],
        queryFn: () => {
            return GetEvents(event_id);
        },
    });

    return (
        <div>
            <h1>Event</h1>
            {isLoading ? (
                <div className="error">Loading...</div>
            ) : (
                <EventCard data={data[0]} key={data[0].id} />
            )}
        </div>
    );
}
