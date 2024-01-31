import axios from "axios";

export default async function Signup(data) {
    return axios.post("http://127.0.0.1:8000/api/signup", data, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
}
