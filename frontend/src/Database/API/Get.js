import axios from "axios";

export default async function Get(endpoint, auth = "") {
    if (auth) auth = `Bearer ${auth}`;

    const headers = {
        Accept: "application/json",
        Authorization: auth,
    };
    return axios
        .get(`http://127.0.0.1:8000/api/${endpoint}`, { headers })
        .then((res) => res.data);
}
