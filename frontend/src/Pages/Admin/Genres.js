import React from "react";

export default function Genres({ data, deleteFn, isDeleting }) {
    return (
        <>
            <h2>Genres</h2>
            {Object.entries(data).map(([key, value]) => (
                <div key={key} value={key} className="event-container">
                    <h3>{value}</h3>
                    <div>
                        <button
                            className="flex-button-orange"
                            onClick={() => {
                                deleteFn(key);
                            }}
                        >
                            {isDeleting === key ? (
                                <i className="bi bi-arrow-clockwise small-loading-anim"></i>
                            ) : (
                                <i className="bi bi-trash-fill"></i>
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}
