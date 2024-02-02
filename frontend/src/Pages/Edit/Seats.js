import React, { useState } from "react";

import SeatingChart from "../../Reuse/Components/SeatingChart";
import GetFullEventByID from "../../Database/API/GetFullEventByID";
import { useQuery } from "@tanstack/react-query";
import GetTicketTypes from "../../Database/API/GetTicketTypes";
import ReactModal from "react-modal";

import DeleteTicketType from "../../Database/API/DeleteTicketType";
import CreateTicketType from "../../Database/API/CreateTicketType";
import CreateEventSeats from "../../Database/API/CreateEventSeats";

export default function Seats({ e }) {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedType, setSelectedType] = useState([]);

    const [createTypePopup, setCreateTypePopup] = useState(false);

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["edit", "seats", e],
        queryFn: () => {
            return GetFullEventByID(e);
        },
    });

    const {
        data: typeData,
        error: typeError,
        isLoading: typeIsLoading,
        refetch: refetchType,
    } = useQuery({
        queryKey: ["edit", "types", e],
        queryFn: () => {
            return GetTicketTypes(e);
        },
    });

    const handleDeleteType = async (id) => {
        if (typeData && typeData.length > 1) {
            setSelectedType([]);
            setSelectedSeats([]);
            await DeleteTicketType(id);
            refetchType();
            refetch();
        }
    };

    const [createEventErrors, setCreateEventErrors] = useState({
        name: ["-"],
        price: ["-"],
    });

    const HandleAddType = async (e) => {
        e.preventDefault();

        setCreateEventErrors({
            name: ["-"],
            price: ["-"],
        });
        const formData = new FormData(e.target);

        const fdata = {
            event_id: data.event.id,
            name: formData.get("name"),
            price: formData.get("price"),
        };

        const result = await CreateTicketType(fdata);
        if (result.errors) {
            setCreateEventErrors({
                ...{
                    name: ["-"],
                    price: ["-"],
                },
                ...result.errors,
            });
        }
        refetchType();
        refetch();
        setCreateTypePopup(false);
    };

    const handleAddEventSeats = async () => {
        if (selectedSeats.length > 0) {
            const result = await CreateEventSeats({
                seats: selectedSeats,
                type: selectedType,
                event: data.event.id,
            });
            console.log(result);
            setSelectedSeats([]);
            refetchType();
            refetch();
        }
    };

    const ToggleCreateTypePopup = () => {
        setCreateEventErrors({
            name: ["-"],
            price: ["-"],
        });
        setCreateTypePopup(!createTypePopup);
    };

    const handleSelectType = (type) => {
        if (selectedType === type) {
            setSelectedType([]);
        } else {
            setSelectedType(type);
        }
    };

    if (isLoading || typeIsLoading)
        return (
            <div>
                <main className="success-main">
                    <i className="bi bi-arrow-clockwise loading-anim"></i>
                </main>
            </div>
        );

    const getTicketTypeIdByName = (name) => {
        // Sort ticketTypes by price in ascending order
        const sortedTicketTypes = [...typeData].sort(
            (a, b) => a.price - b.price
        );

        // Assign IDs from 1 to 4
        const ticketTypesWithIds = sortedTicketTypes.map((type, index) => ({
            ...type,
            id: index + 1,
        }));

        // Find the ID by name
        const foundType = ticketTypesWithIds.find((type) => type.name === name);

        // Return the ID if found, otherwise return null
        return foundType ? foundType.id : null;
    };
    return (
        <>
            <ReactModal
                isOpen={createTypePopup}
                onRequestClose={ToggleCreateTypePopup}
                overlayClassName="login-modal-overlay"
                className="login-modal-content"
                closeTimeoutMS={300}
            >
                <h2>Create Ticket Type</h2>
                <form onSubmit={HandleAddType} className="ticket-form">
                    <div className="input-container">
                        <p>name</p>
                        <input type="text" className="flex-input" name="name" />
                    </div>

                    <div className="input-container">
                        <p>price</p>
                        <input
                            type="number"
                            step=".01"
                            className="flex-input"
                            name="price"
                        />
                    </div>

                    <button className="flex-button" type="submit">
                        Create Ticket Type
                    </button>
                </form>
            </ReactModal>
            <div className="title-container">
                <h2>Seats & Tickets</h2>
                <div className="buttons">
                    <button className="flex-button">/</button>
                </div>
            </div>
            <div className="ticket-wrapper">
                {typeData.map((type) => (
                    <div
                        className={`ticket-type ${
                            selectedType === type.id ? "selected" : ""
                        }`}
                        onClick={() => {
                            handleSelectType(type.id);
                        }}
                    >
                        <div
                            className={`color type-${getTicketTypeIdByName(
                                type.name
                            )}`}
                            onClick={() => {
                                handleDeleteType(type.id);
                            }}
                        ></div>
                        <p>
                            {type.name} • {type.price}€
                        </p>
                    </div>
                ))}
                {typeData.length < 4 && (
                    <div
                        className="ticket-type"
                        onClick={ToggleCreateTypePopup}
                    >
                        <p>+</p>
                    </div>
                )}
            </div>
            <SeatingChart
                seatsData={data.seats}
                maxCols={data.event.max_cols}
                ticketTypes={typeData}
                setSelectedSeats={setSelectedSeats}
                selectedSeats={selectedSeats}
                DisplayOnly={false}
            />
            <div className="set-ticket-type">
                <button className="flex-button" onClick={handleAddEventSeats}>
                    Apply Type
                </button>
            </div>
        </>
    );
}
