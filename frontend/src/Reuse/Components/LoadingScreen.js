import React from "react";
import NavPadding from "./NavPadding";

export default function LoadingScreen() {
    return (
        <div>
            <NavPadding />
            <main className="success-main">
                <i className="bi bi-arrow-clockwise loading-anim"></i>
            </main>
        </div>
    );
}
