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

import "./index.css";
import Landing from "./Pages/Main";

const App = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<Landing />} />
        </Routes>
    );
};

const root = createRoot(document.getElementById("root"));

const queryClient = new QueryClient();

root.render(
    <QueryClientProvider client={queryClient}>
        <React.StrictMode>
            <Router>
                <App />
            </Router>
        </React.StrictMode>
    </QueryClientProvider>
);
