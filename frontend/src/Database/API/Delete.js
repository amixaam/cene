import axios from "axios";

export default async function Delete(endpoint, auth = "", data = "") {
    if (auth) auth = `Bearer ${auth}`;

    const headers = {
        Accept: "application/json",
        Authorization: auth,
    };
    return axios
        .delete(`http://127.0.0.1:8000/api/${endpoint}/${data}`, { headers })
        .then((res) => res.data);
}
