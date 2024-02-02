import axios from "axios";

export default async function DeleteTicketType(id) {
    const token = sessionStorage.getItem("token");
    return axios
        .delete(`http://127.0.0.1:8000/api/events/type/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.data);
}
