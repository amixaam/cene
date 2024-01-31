import React, { useEffect, useState } from "react";
import NavPadding from "../../Reuse/Components/NavPadding";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";

import "../../CSS/Admin.scss";

export default function Admin() {
    const [createEventModal, setCreateEventModal] = useState(true);
    const toggleCreateEventModal = () => {
        setCreateEventModal(!createEventModal);
    };

    const navigate = useNavigate();
    const checkAuth = () => {
        if (!sessionStorage.getItem("token")) {
            navigate("/");
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);
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
                <div className="form">
                    <div className="date-time">
                        <div className="input-container">
                            <div className="text">
                                <p>Date</p>
                                <p>Error</p>
                            </div>
                            <input type="date" className="flex-input" />
                        </div>
                        <div className="input-container">
                            <div className="text">
                                <p>Time</p>
                                <p>Error</p>
                            </div>
                            <input type="time" className="flex-input" />
                        </div>
                        <div className="input-container">
                            <div className="text">
                                <p>Length</p>
                                <p>Error</p>
                            </div>
                            <input type="number" className="flex-input" />
                        </div>
                    </div>
                    <div className="seats">
                        <div className="input-container">
                            <div className="text">
                                <p>Max cols</p>
                                <p>Error</p>
                            </div>
                            <input type="num" className="flex-input" />
                        </div>
                        <div className="input-container">
                            <div className="text">
                                <p>Max Rows</p>
                                <p>Error</p>
                            </div>
                            <input type="num" className="flex-input" />
                        </div>
                    </div>
                    <div className="general">
                        <div className="input-container">
                            <div className="text">
                                <p>Name</p>
                                <p>Error</p>
                            </div>
                            <input type="text" className="flex-input" />
                        </div>
                        <div className="input-container">
                            <div className="text">
                                <p>Description</p>
                                <p>Error</p>
                            </div>
                            <input type="text" className="flex-input" />
                        </div>
                        <div className="input-container">
                            <div className="text">
                                <p>Image</p>
                                <p>Error</p>
                            </div>
                            <input type="file" className="flex-input" />
                        </div>
                    </div>
                    <div className="filtering">
                        <div className="input-container">
                            <div className="text">
                                <p>Genre</p>
                                <p>Error</p>
                            </div>
                            <select
                                name=""
                                id=""
                                className="flex-input"
                            ></select>
                        </div>
                        <div className="input-container">
                            <div className="text">
                                <p>Age rating</p>
                                <p>Error</p>
                            </div>
                            <select
                                className="flex-input"
                                name=""
                                id=""
                            ></select>
                        </div>
                    </div>
                </div>
                <button className="flex-button">Create</button>
            </ReactModal>
            <main className="success-main">
                <button
                    className="flex-button"
                    onClick={toggleCreateEventModal}
                >
                    Add Event
                </button>
            </main>
        </div>
    );
}
