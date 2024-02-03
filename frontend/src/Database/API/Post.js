import axios from "axios";

export default async function Post(endpoint, auth = "", data) {
    if (auth) auth = `Bearer ${auth}`;

    const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: auth,
    };
    return axios
        .post(`http://127.0.0.1:8000/api/${endpoint}`, data, { headers })
        .then((res) => res.data)
        .catch((error) => {
            if (error.response && error.response.data) {
                console.log("ERROR");
                return error.response.data;
            } else {
                console.error("An unexpected error occurred:", error.message);
            }
        });
}
