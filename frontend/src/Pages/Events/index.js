import React, { useState } from "react";
import NavPadding from "../../Reuse/Components/NavPadding";

import "../../CSS/Events.scss";
import { useQuery } from "@tanstack/react-query";
import GetEvents from "../../Database/API/GetEvents";
import EventCard from "../../Reuse/Components/EventCard";
import GetGenres from "../../Database/API/GetGenres";
import GetReviews from "../../Database/API/GetReviews";

export default function Events() {
    const {
        data: eventData,
        error: eventError,
        isLoading: eventisLoading,
    } = useQuery({
        queryKey: ["events"],
        queryFn: GetEvents,
    });

    const {
        data: genreData,
        error: genreError,
        isLoading: genreisLoading,
    } = useQuery({
        queryKey: ["genres"],
        queryFn: GetGenres,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

    if (eventisLoading || genreisLoading) {
        return (
            <div>
                <NavPadding />
                <main className="success-main">
                    <i className="bi bi-arrow-clockwise loading-anim"></i>
                </main>
            </div>
        );
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    };

    let filteredEvents = eventData;

    // Filter by search term
    if (searchTerm) {
        filteredEvents = eventData.filter((event) =>
            event.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Filter by selected genre
    if (selectedGenre) {
        filteredEvents = filteredEvents.filter((event) => {
            return event.genre_id === parseInt(selectedGenre, 10);
        });
    }

    const handleEventRedirect = (event_id) => {
        window.location.href = `/event?e=${event_id}`;
    };

    return (
        <div>
            <NavPadding />
            <div className="search-bar">
                <div className="side-margins">
                    <input
                        placeholder="Search..."
                        type="text"
                        className="flex-input-white"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <select
                        name="genreFilter"
                        id="genreFilter"
                        value={selectedGenre}
                        onChange={handleGenreChange}
                    >
                        <option value="">All Genres</option>
                        {Object.entries(genreData).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="content side-margins">
                <h2>Upcoming Events</h2>
                <div className="events">
                    {eventisLoading ? (
                        <div className="error">Loading...</div>
                    ) : (
                        filteredEvents.map((item) => (
                            <EventCard
                                data={item}
                                handleEventRedirect={handleEventRedirect}
                                key={item.id}
                            />
                        ))
                        // <p></p>
                    )}
                </div>
            </div>
        </div>
    );
}
