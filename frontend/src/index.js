import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useLocalStorage } from "@uidotdev/usehooks";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

import Landing from "./Pages/Main";
import Authenticate from "./Pages/Authenticate";
import Admin from "./Pages/Admin";
import Events from "./Pages/Events";
import SuccessPayment from "./Pages/Payment";
import Event from "./Pages/Event";

const App = () => {
    const location = useLocation();
    const [theme, setTheme] = useLocalStorage("theme" ? "light" : "dark");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div data-theme={theme}>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/events" element={<Events />} />
                <Route path="/event/:e" element={<Event />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/auth" element={<Authenticate />} />
                <Route path="/success" element={<SuccessPayment />} />
            </Routes>
        </div>
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
