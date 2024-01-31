import React from "react";

import "../../CSS/Profile.scss";

export default function Edit() {
    return (
        <>
            <div className="input-container">
                <p>Name</p>
                <input type="text" className="flex-input" />
            </div>
            <div className="input-container">
                <p>Password</p>
                <input type="text" className="flex-input" />
            </div>
            <div className="input-container">
                <p>Password repeat</p>
                <input type="text" className="flex-input" />
            </div>
            <div className="button-container">
                <button className="flex-button">Change Edits</button>
            </div>
        </>
    );
}
