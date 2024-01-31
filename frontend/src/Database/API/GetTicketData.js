import axios from "axios";

export default function GetTicketData() {
    const token = sessionStorage.getItem("token");

    return axios.get("http://127.0.0.1:8000/api/payments/history", {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}
