import axios from "axios";

export default async function GetEventByID(id) {
    const headers = {
        Accept: "application/json",
    };
    return axios
        .get(`http://127.0.0.1:8000/api/events/${id}`, { headers })
        .then((res) => res.data);
}
