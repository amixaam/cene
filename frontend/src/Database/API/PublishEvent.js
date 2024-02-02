import axios from "axios";

export default async function PublishEvent(id) {
    const token = sessionStorage.getItem("token");
    console.log(token);
    return axios
        .get(`http://127.0.0.1:8000/api/events/publish/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.data);
}
