import React, { useEffect, useState } from "react";

import NavPadding from "../../Reuse/Components/NavPadding";
import "../../CSS/Profile.scss";
import { useNavigate } from "react-router-dom";
import Payments from "./Payments";
import Edit from "./Edit";

export default function Profile({ handleLogout }) {
    const [selectedOption, setSelectedOption] = useState("Payment");

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
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
        <>
            <NavPadding />
            <div className="profile-wrapper side-margins">
                <div className="info-wrapper">
                    <h2>Glad You're Here!</h2>
                </div>
                <div className="content-wrapper">
                    <aside className="sidebar">
                        <button
                            className={`flex-button-list ${
                                selectedOption === "Payment" ? "selected" : ""
                            }`}
                            onClick={() => {
                                handleOptionSelect("Payment");
                            }}
                        >
                            Payments
                        </button>
                        <button
                            className={`flex-button-list ${
                                selectedOption === "Edit" ? "selected" : ""
                            }`}
                            onClick={() => {
                                handleOptionSelect("Edit");
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className="flex-button-list"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </aside>
                    <main className="content">
                        {selectedOption === "Payment" ? <Payments /> : <Edit />}
                    </main>
                </div>
            </div>
        </>
    );
}
