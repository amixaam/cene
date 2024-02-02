import axios from "axios";

export default async function CreateEventSeats(data) {
    const token = sessionStorage.getItem("token");

    return axios
        .post("http://127.0.0.1:8000/api/events/seats", data, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
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
