import axios from "axios";

export default async function GetAllEvents() {
    const headers = {
        Accept: "application/json",
    };
    return axios
        .get("http://127.0.0.1:8000/api/events/all", { headers })
        .then((res) => res.data);
}
