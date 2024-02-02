import axios from "axios";

export default async function GetTicketTypes(event_id) {
    const headers = {
        Accept: "application/json",
    };
    return axios
        .get(`http://127.0.0.1:8000/api/events/types/${event_id}`, { headers })
        .then((res) => res.data);
}
