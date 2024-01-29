import axios from "axios";

export default async function ConfirmPayment(session) {
    const token = sessionStorage.getItem("token");

    const body = {
        session_id: session,
    };

    return axios.post("http://127.0.0.1:8000/api/payments/success", body, {
        headers: {
            Accept: "application/json",
            Authorization:
                "Bearer 1|GatRsKm5Z5xbJyusAFC44K3mPffk0b4xCy4fgXKJecfca1e1",
        },
    });
}
