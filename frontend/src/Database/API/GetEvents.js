import axios from "axios";

export default async function GetEvents() {
    const headers = {
        Accept: "application/json",
    };
    return axios
        .get("http://127.0.0.1:8000/api/events", { headers })
        .then((res) => res.data);
}
