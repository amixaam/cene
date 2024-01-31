import axios from "axios";

export default async function CancelPayment(session) {
    const token = sessionStorage.getItem("token");
    console.log(token);

    const body = {
        session_id: session,
    };

    return axios.post("http://127.0.0.1:8000/api/payments/cancel", body, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}
