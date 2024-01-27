import { useQuery } from "@tanstack/react-query";
import React from "react";
import GetGenres from "../../Database/API/GetGenres";

export default function Landing() {
    // Using the hook
    const dataQuery = useQuery({
        queryKey: ["test"],
        queryFn: GetGenres,
    });
    // Error and Loading states
    if (dataQuery.isError) return <pre>{JSON.stringify(dataQuery.error)}</pre>;
    if (dataQuery.isLoading) return <div>Loading...</div>;

    return (
        <div>
            <i className="bi bi-sun-fill large-icon"></i>
            <i className="bi bi-moon-stars-fill"></i>

            <h1>Landing</h1>

            {dataQuery.data.map((item) => (
                <div key={item.id}>
                    <img src={item.file_path} alt={item.name} />
                    <h1>{item.name}</h1>
                    <p>{item.description}</p>
                    <p>
                        {item.date}
                        <br />
                        {item.time}
                    </p>
                </div>
            ))}
        </div>
    );
}
