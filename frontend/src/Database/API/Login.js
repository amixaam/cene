import axios from "axios";

export default async function Login(data) {
    return axios.post("http://127.0.0.1:8000/api/login", data, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
}
