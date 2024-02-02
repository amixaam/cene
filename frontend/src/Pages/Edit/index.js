import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavPadding from "../../Reuse/Components/NavPadding";

import "../../CSS/EditEvent.scss";

import GetFullEventByID from "../../Database/API/GetFullEventByID";
import General from "./General";
import Seats from "./Seats";
import Time from "./Time";
import ReactModal from "react-modal";
import DeleteEvent from "../../Database/API/DeleteEvent";
import PublishEvent from "../../Database/API/PublishEvent";

export default function Edit() {
    const [currentPage, setCurrentPage] = useState("Seats");
    const [toggleConfirmPopup, setToggleConfirmPopup] = useState(false);
    const [togglePublishPopup, setTogglePublishPopup] = useState(false);

    const { e: event_id } = useParams();
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["event", "edit", event_id],
        queryFn: () => {
            return GetFullEventByID(event_id);
        },
    });

    const handleToggleConfirmPopup = () => {
        setToggleConfirmPopup(!toggleConfirmPopup);
    };
    const handleTogglePublishPopup = () => {
        setTogglePublishPopup(!togglePublishPopup);
    };

    const checkIfPurchased = () => {
        if (data.seats.length === data.freeSeats) {
            return false;
        } else return true;
    };

    const navigate = useNavigate();
    const handleDeleteEvent = async () => {
        if (!checkIfPurchased()) {
            await DeleteEvent(event_id);
            navigate("/admin");
        }
    };
    const hanldePublishEvent = async () => {
        await PublishEvent(event_id);
        handleTogglePublishPopup();
        refetch();
    };

    const checkAuth = () => {
        if (!sessionStorage.getItem("token")) {
            navigate("/");
        }
    };
    useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading)
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
                isOpen={toggleConfirmPopup}
                onRequestClose={handleToggleConfirmPopup}
                overlayClassName="login-modal-overlay"
                className="login-modal-content"
                closeTimeoutMS={300}
            >
                <h2>Are you sure?</h2>
                <p>You cannot undo this action.</p>
                <div className="buttons-confirm">
                    <button
                        className="flex-button delete-button"
                        onClick={handleDeleteEvent}
                    >
                        Delete
                    </button>
                    <button
                        className="flex-button"
                        onClick={handleToggleConfirmPopup}
                    >
                        Cancel
                    </button>
                </div>
            </ReactModal>
            <ReactModal
                isOpen={togglePublishPopup}
                onRequestClose={handleTogglePublishPopup}
                overlayClassName="login-modal-overlay"
                className="login-modal-content"
                closeTimeoutMS={300}
            >
                <h2>Are you sure?</h2>
                <p>
                    You may not be able to edit specific items when published.
                </p>
                <p>You also won't be able to reverse this.</p>
                <div className="buttons-confirm">
                    <button
                        className="flex-button delete-button"
                        onClick={hanldePublishEvent}
                    >
                        Publish
                    </button>
                    <button
                        className="flex-button"
                        onClick={handleTogglePublishPopup}
                    >
                        Cancel
                    </button>
                </div>
            </ReactModal>
            <div className="edit-view">
                <div className="side-bar">
                    <button
                        className={`flex-button ${
                            currentPage === "General" ? "selected-button" : ""
                        }`}
                        onClick={() => {
                            setCurrentPage("General");
                        }}
                    >
                        General
                    </button>
                    <button
                        className={`flex-button ${
                            currentPage === "Seats" ? "selected-button" : ""
                        }`}
                        onClick={() => {
                            setCurrentPage("Seats");
                        }}
                    >
                        Seats & Tickets
                    </button>
                    <button
                        className={`flex-button ${
                            currentPage === "Time" ? "selected-button" : ""
                        }`}
                        onClick={() => {
                            setCurrentPage("Time");
                        }}
                    >
                        Time & Date
                    </button>
                    <div className="buttons">
                        <button
                            className={`flex-button ${
                                data.event.published ? "gray-out" : ""
                            }`}
                            onClick={handleTogglePublishPopup}
                            disabled={data.event.published}
                        >
                            Publish
                        </button>
                        <button
                            className="flex-button"
                            onClick={handleToggleConfirmPopup}
                        >
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                    <div className="stats">
                        <h3>Statistics</h3>
                        <p>Revenue</p>
                        <p>Tickets Sold</p>
                        <p>Ratings</p>
                        <p>Avrg. Rating</p>
                    </div>
                </div>
                <div className="edit-content-wrapper">
                    <Link to="/admin" className="flex-button edit-back">
                        <i className="bi bi-caret-left-fill"></i>
                    </Link>
                    {currentPage === "General" && <General />}
                    {currentPage === "Seats" && <Seats e={event_id} />}
                    {currentPage === "Time" && <Time />}
                </div>
            </div>
        </div>
    );
}
