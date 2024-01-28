import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Landing from "./Pages/Main";
import Authenticate from "./Pages/Authenticate";
import Admin from "./Pages/Admin";
import Events from "./Pages/Events";
import SuccessPayment from "./Pages/Payment/Success";
import CancelPayment from "./Pages/Payment/Cancel";

const App = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/events" element={<Events />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/auth" element={<Authenticate />} />
            <Route path="/payment/success" element={<SuccessPayment />} />
            <Route path="/payment/cancel" element={<CancelPayment />} />
        </Routes>
    );
};

const root = createRoot(document.getElementById("root"));
const queryClient = new QueryClient();
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Router>
                <App />
            </Router>
            <ReactQueryDevtools />
        </QueryClientProvider>
    </React.StrictMode>
);
