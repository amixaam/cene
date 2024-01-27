import axios from "axios";

export default async function GetGenres() {
    const headers = {
        Accept: "application/json",
        Authorization:
            "Bearer 1|GatRsKm5Z5xbJyusAFC44K3mPffk0b4xCy4fgXKJecfca1e1",
    };
    return axios
        .get("http://127.0.0.1:8000/api/events", { headers })
        .then((res) => res.data);
}
