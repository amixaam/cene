import React, { useEffect, useState } from "react";
import NavPadding from "../../Reuse/Components/NavPadding";
import { Link, useNavigate } from "react-router-dom";
import ReactModal from "react-modal";

import "../../CSS/Admin.scss";

import CreateEvent from "../../Database/API/CreateEvent";
import { useQuery } from "@tanstack/react-query";
import GetOptions from "../../Database/API/GetOptions";
import GetAllEvents from "../../Database/API/GetAllEvents";

export default function Admin() {
    const [createEventModal, setCreateEventModal] = useState(false);
    const [createEventErrors, setCreateEventErrors] = useState({
        file: ["-"],
        name: ["-"],
        description: ["-"],
        date: ["-"],
        time: ["-"],
        length: ["-"],
        max_cols: ["-"],
        max_rows: ["-"],
        age_rating_id: ["-"],
        genre_id: ["-"],
    });

    const toggleCreateEventModal = () => {
        resetCreateEventErrors();
        setCreateEventModal(!createEventModal);
    };

    const {
        data: optionsData,
        error: optionsError,
        isLoading: optionsisLoading,
    } = useQuery({
        queryKey: ["options"],
        queryFn: GetOptions,
    });

    const {
        data: eventsData,
        error: eventsError,
        isLoading: eventsisLoading,
        refetch: refetchEvents,
    } = useQuery({
        queryKey: ["events", "admin"],
        queryFn: GetAllEvents,
    });

    const navigate = useNavigate();
    const checkAuth = () => {
        if (!sessionStorage.getItem("token")) {
            navigate("/");
        }
    };
    useEffect(() => {
        checkAuth();
    }, []);

    const resetCreateEventErrors = () => {
        setCreateEventErrors({
            file: ["-"],
            name: ["-"],
            description: ["-"],
            date: ["-"],
            time: ["-"],
            length: ["-"],
            max_cols: ["-"],
            max_rows: ["-"],
            age_rating_id: ["-"],
            genre_id: ["-"],
        });
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            formData.append("file", e.target.elements.image.files[0], "jun");
        } catch {
            formData.append("file", null);
        }

        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
            date: formData.get("date"),
            time: formData.get("time"),
            length: formData.get("length"),
            max_cols: formData.get("cols"),
            max_rows: formData.get("rows"),
            file: formData.get("file"),
            age_rating_id: formData.get("rating"),
            genre_id: formData.get("genre"),
        };

        const result = await CreateEvent(data);
        console.log(result);
        if (result.errors) {
            // resetCreateEventErrors();
            // console.log(createEventErrors);
            setCreateEventErrors({
                ...{
                    file: ["-"],
                    name: ["-"],
                    description: ["-"],
                    date: ["-"],
                    time: ["-"],
                    length: ["-"],
                    max_cols: ["-"],
                    max_rows: ["-"],
                    age_rating_id: ["-"],
                    genre_id: ["-"],
                },
                ...result.errors,
            });
        } else {
            toggleCreateEventModal();
            refetchEvents();
        }
    };

    if (optionsisLoading || eventsisLoading)
        return (
            <div>
                <NavPadding />
                <main className="success-main">
                    <i className="bi bi-arrow-clockwise loading-anim"></i>
                </main>
            </div>
        );
    return (
        <div>
            <NavPadding />
            <ReactModal
                isOpen={createEventModal}
                onRequestClose={toggleCreateEventModal}
                overlayClassName="login-modal-overlay"
                className="login-modal-content"
                closeTimeoutMS={300}
            >
                <h2>Create Event</h2>
                <form onSubmit={handleCreateProject} className="form">
                    <div className="date-time">
                        <div className="input-container">
                            <p>Date</p>
                            <input
                                type="date"
                                className="flex-input"
                                name="date"
                            />
                            <p>{createEventErrors.date[0]}</p>
                        </div>
                        <div className="input-container">
                            <p>Time</p>
                            <input
                                type="time"
                                className="flex-input"
                                name="time"
                            />
                            <p>{createEventErrors.time[0]}</p>
                        </div>
                        <div className="input-container">
                            <p>Length</p>
                            <input
                                type="number"
                                className="flex-input"
                                name="length"
                            />
                            <p>{createEventErrors.length[0]}</p>
                        </div>
                    </div>
                    <div className="seats">
                        <div className="input-container">
                            <p>Max cols</p>
                            <input
                                type="number"
                                className="flex-input"
                                name="cols"
                            />
                            <p>{createEventErrors.max_cols[0]}</p>
                        </div>
                        <div className="input-container">
                            <p>Max Rows</p>
                            <input
                                type="number"
                                className="flex-input"
                                name="rows"
                                max={7}
                            />
                            <p>{createEventErrors.max_rows[0]}</p>
                        </div>
                    </div>
                    <div className="general">
                        <div className="input-container">
                            <p>Name</p>
                            <input
                                type="text"
                                className="flex-input"
                                name="name"
                            />
                            <p>{createEventErrors.name[0]}</p>
                        </div>
                        <div className="input-container">
                            <p>Description</p>
                            <input
                                type="text"
                                className="flex-input"
                                name="description"
                            />
                            <p>{createEventErrors.description[0]}</p>
                        </div>
                        <div className="input-container">
                            <p>Image</p>
                            <input
                                type="file"
                                className="flex-input"
                                name="image"
                            />
                            <p>{createEventErrors.file[0]}</p>
                        </div>
                    </div>
                    <div className="filtering">
                        <>
                            <div className="input-container">
                                <p>Genre</p>
                                <select name="genre" className="flex-input">
                                    <option disabled selected="true">
                                        Select
                                    </option>
                                    {Object.entries(optionsData.genres).map(
                                        ([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        )
                                    )}
                                </select>
                                <p>{createEventErrors.genre_id[0]}</p>
                            </div>
                            <div className="input-container">
                                <p>Age rating</p>
                                <select className="flex-input" name="rating">
                                    <option disabled selected="true">
                                        Select
                                    </option>
                                    {Object.entries(
                                        optionsData.age_ratings
                                    ).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                                <p>{createEventErrors.age_rating_id[0]}</p>
                            </div>
                        </>
                    </div>
                    <button className="flex-button" type="submit">
                        Create
                    </button>
                </form>
            </ReactModal>
            <main className="admin-main">
                <div className="sidebar">
                    <button
                        className="flex-button"
                        onClick={toggleCreateEventModal}
                    >
                        Add Event
                    </button>
                </div>
                <div className="content-container">
                    {eventsisLoading ? (
                        <p className="loading-screen"></p>
                    ) : (
                        eventsData.map((event) => (
                            <div className="event-container" key={event.id}>
                                <img src={event.file_path} alt="" />
                                <div className="event-info">
                                    <div className="left-side">
                                        <h3>{event.name}</h3>
                                        <p>published?</p>
                                        <p>seats taken</p>
                                        <p>total revenue</p>
                                    </div>
                                    <div className="right-side">
                                        <Link
                                            to={`edit/${event.id}`}
                                            className="flex-button"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
