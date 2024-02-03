import React, { useEffect } from "react";
import "../../CSS/Input.scss";

export default function Input({
    type = "text",
    name = "",
    displayName = "",
    placeholder = "",
    options = [],
    error = "",
    ...restProps
}) {
    if (name && !displayName) displayName = name;

    return (
        <div className="input-container">
            <p className="display-name">{displayName}</p>
            {type === "select" ? (
                <select className="flex-input" name={name} {...restProps}>
                    <option value="" disabled>
                        Select
                    </option>
                    {Object.entries(options).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    className="flex-input"
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    {...restProps}
                />
            )}
            <p className="error">{error}</p>
        </div>
    );
}
