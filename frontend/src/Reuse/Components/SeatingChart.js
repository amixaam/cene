import React, { useState } from "react";

import "../../CSS/SeatingChart.scss";

const SeatingChart = ({
    seatsData,
    maxCols,
    ticketTypes,
    DisplayOnly = false,
}) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const getTicketTypeIdByName = (name) => {
        const index = ticketTypes.findIndex((type) => type.name === name);
        return index !== -1 ? index : null;
    };

    const handleSeatClick = (row, col, name, price, taken) => {
        if (!taken && !DisplayOnly) {
            // Get the ticket type ID based on the seat name
            const ticketTypeId = getTicketTypeIdByName(name);

            // Toggle the selected state of the seat
            const isSelected = selectedSeats.some(
                (seat) => seat.row === row && seat.col === col
            );
            if (isSelected) {
                setSelectedSeats(
                    selectedSeats.filter(
                        (seat) => !(seat.row === row && seat.col === col)
                    )
                );
            } else {
                setSelectedSeats([
                    ...selectedSeats,
                    { row, col, name, price, ticketTypeId },
                ]);
            }
        }
    };

    // Manually group seatsData into rows
    const groupedSeatsData = [];
    for (let i = 0; i < seatsData.length; i += maxCols) {
        groupedSeatsData.push(seatsData.slice(i, i + maxCols));
    }

    return (
        <div className="seating-chart">
            {groupedSeatsData.map((seatRow, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                    {seatRow.map((seat) => (
                        <div
                            key={`${seat.row}-${seat.col}`}
                            className={`seat ${seat.taken ? "taken" : ""} ${
                                selectedSeats.some(
                                    (s) =>
                                        s.row === seat.row && s.col === seat.col
                                )
                                    ? "selected"
                                    : ""
                            } type-${getTicketTypeIdByName(seat.name)}`}
                            onClick={() =>
                                handleSeatClick(
                                    seat.row,
                                    seat.col,
                                    seat.name,
                                    seat.price,
                                    seat.taken
                                )
                            }
                            disabled={DisplayOnly}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SeatingChart;
