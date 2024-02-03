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
            <div className="profile-wrapper">
                <div className="side-bar-view">
                    <aside className="side-bar">
                        <div className="selections">
                            <button
                                className={`flex-button-list ${
                                    selectedOption === "Payment"
                                        ? "selected"
                                        : ""
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
                        </div>
                    </aside>
                    <main className="side-bar-content-view gap-1">
                        {selectedOption === "Payment" ? <Payments /> : <Edit />}
                    </main>
                </div>
            </div>
        </>
    );
}
