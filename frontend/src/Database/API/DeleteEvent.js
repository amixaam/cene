import axios from "axios";

export default async function DeleteEvent(id) {
    const token = sessionStorage.getItem("token");
    return axios
        .delete(`http://127.0.0.1:8000/api/events/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.data);
}
