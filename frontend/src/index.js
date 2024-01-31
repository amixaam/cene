import React, { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactModal from "react-modal";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

import Fav1 from "./Images/Decoration/fav1.svg";
import Fav2 from "./Images/Decoration/fav2.svg";
import Fav3 from "./Images/Decoration/fav3.svg";

import Landing from "./Pages/Main";
import Admin from "./Pages/Admin";
import Events from "./Pages/Events";
import SuccessPayment from "./Pages/Payment";
import Event from "./Pages/Event";

import Signup from "./Database/API/Signup";
import Login from "./Database/API/Login";

const App = () => {
    const location = useLocation();
    const [theme, setTheme] = useLocalStorage("theme" ? "light" : "dark");
    const [isScrolled, setIsScrolled] = useState(false);

    const [loginPopup, setLoginPopup] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [isLoginButtonLoading, setIsLoginButtonLoading] = useState(false);
    const [authForm, setAuthForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [formError, setFormError] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 100;
            setIsScrolled(scrolled);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleAuthorization = async () => {
        setFormError({
            name: "",
            email: "",
            password: "",
        });
        setIsLoginButtonLoading(true);
        let hasError = false;
        if (authForm.password.length < 6) {
            setFormError((prevFormError) => ({
                ...prevFormError,
                password: "Must have atleast 6 chars",
            }));
            hasError = true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(authForm.email)) {
            setFormError((prevFormError) => ({
                ...prevFormError,
                email: "Email is not valid",
            }));
            hasError = true;
        }

        Object.keys(authForm).forEach((element) => {
            if (authForm[element] === "") {
                if (element === "name" && !isRegister) return;

                setFormError((prevFormError) => ({
                    ...prevFormError,
                    [element]: "Required",
                }));
                hasError = true;
            }
        });

        if (!hasError) {
            if (isRegister) {
                try {
                    const res = await Signup(authForm);
                    setIsLoginButtonLoading(false);
                    sessionStorage.setItem("token", res.data.token);
                    sessionStorage.setItem("user_id", res.data.user.id);
                    sessionStorage.setItem("role", res.data.user.role);
                    setLoginPopup(false);
                } catch {
                    setFormError((prevFormError) => ({
                        ...prevFormError,
                        name: "Server error",
                    }));
                }
            } else {
                try {
                    const res = await Login(authForm);
                    setIsLoginButtonLoading(false);
                    sessionStorage.setItem("token", res.data.token);
                    sessionStorage.setItem("user_id", res.data.user.id);
                    sessionStorage.setItem("role", res.data.user.role);
                    setLoginPopup(false);
                } catch {
                    setFormError((prevFormError) => ({
                        ...prevFormError,
                        email: "Incorrect credentials",
                    }));
                }
            }
        }
    };

    const toggleIsRegisterState = () => {
        if (isRegister) setIsRegister(false);
        else setIsRegister(true);

        setAuthForm({
            name: "",
            password: "",
            email: "",
        });
        setFormError({
            name: "",
            password: "",
            email: "",
        });
    };

    const toggleLoginOpen = () => {
        if (loginPopup) setLoginPopup(false);
        else setLoginPopup(true);
        setAuthForm({
            name: "",
            password: "",
            email: "",
        });
        setFormError({
            name: "",
            password: "",
            email: "",
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAuthForm((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("role");
        window.location.reload();
    };

    return (
        <div data-theme={theme} className="wrap">
            <ReactModal
                isOpen={loginPopup}
                onRequestClose={toggleLoginOpen}
                overlayClassName="login-modal-overlay"
                className="login-modal-content"
                closeTimeoutMS={300}
            >
                <h2>{isRegister ? "Sign up" : "Log in"}</h2>
                <div className="form-wrapper">
                    {isRegister && (
                        <div className="input-wrapper">
                            <div className="info-wrapper">
                                <p>Name</p>
                                <p>{formError.name}</p>
                            </div>
                            <input
                                type="text"
                                name="name"
                                className="flex-input"
                                value={authForm.name}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    <div className="input-wrapper">
                        <div className="info-wrapper">
                            <p>Email</p>
                            <p>{formError.email}</p>
                        </div>
                        <input
                            type="email"
                            name="email"
                            className="flex-input"
                            value={authForm.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-wrapper">
                        <div className="info-wrapper">
                            <p>Password</p>
                            <p>{formError.password}</p>
                        </div>
                        <input
                            type="password"
                            name="password"
                            className="flex-input"
                            value={authForm.password}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <button className="flex-button" onClick={handleAuthorization}>
                    {isLoginButtonLoading ? (
                        <i className="bi bi-arrow-clockwise"></i>
                    ) : isRegister ? (
                        "Sign up"
                    ) : (
                        "Log in"
                    )}
                </button>

                {!isRegister && (
                    <div className="options-text">
                        <p>First time here?</p>
                        <p onClick={toggleIsRegisterState}>Sign up.</p>
                    </div>
                )}
                {isRegister && (
                    <div className="options-text">
                        <p>Already an user?</p>
                        <p onClick={toggleIsRegisterState}>Log in.</p>
                    </div>
                )}
            </ReactModal>
            <nav className={`${isScrolled ? "scrolled" : ""}`}>
                <div className="content-wrapper side-margins">
                    <div className="view-links-wrapper">
                        <Link className="logo" to="/">
                            CN
                        </Link>
                        <Link className="regular" to="events">
                            Events
                        </Link>
                        {sessionStorage.getItem("role") && (
                            <Link className="regular">Admin</Link>
                        )}
                    </div>
                    <div className="user-links-wrapper">
                        {sessionStorage.getItem("token") ? (
                            <button className="regular" onClick={handleLogout}>
                                Log out
                            </button>
                        ) : (
                            <>
                                <button
                                    className="regular"
                                    onClick={() => {
                                        toggleLoginOpen();
                                        setIsRegister(false);
                                    }}
                                >
                                    Log in
                                </button>
                                <button
                                    className="flex-button-white"
                                    onClick={() => {
                                        toggleLoginOpen();
                                        setIsRegister(true);
                                    }}
                                >
                                    Sign up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/events" element={<Events />} />
                <Route path="/event/:e" element={<Event />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/success" element={<SuccessPayment />} />
            </Routes>
            <footer>
                <div className="footer-wrapper side-margins">
                    <div className="info-wrapper">
                        <h3>CENE</h3>
                        <p>By @amixaam</p>
                        <div className="icon-wrapper">
                            <a
                                href="https://www.instagram.com/robisnis/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a
                                href="https://www.youtube.com/channel/UCzjSXL5ODJxapJeSPkUUNmA"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-youtube"></i>
                            </a>
                            <a
                                href="https://github.com/amixaam"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-github"></i>
                            </a>
                        </div>
                    </div>
                    <div className="info-wrapper">
                        <h3 className="programs-text">PROGRAMS</h3>
                        <div className="text-wrapper">
                            <div className="text-chunk">
                                <p>React</p>
                                <p>Laravel</p>
                                <p>VS Code</p>
                            </div>
                            <div className="text-chunk">
                                <p>Figma</p>
                                <p>DrawIO</p>
                                <p>Postman</p>
                            </div>
                            <div className="text-chunk">
                                <p>VS Code</p>
                                <p>GitHub</p>
                            </div>
                        </div>
                    </div>
                    <div className="info-wrapper">
                        <h3>CREDITS</h3>
                        <div className="credits-wrapper">
                            <a
                                href="http://realtimecolors.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={Fav1} alt="Realtimecolors.com icon" />
                            </a>
                            <a
                                href="http://unsplash.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={Fav2} alt="Unsplash.com icon" />
                            </a>
                            <a
                                href="https://www.cesukoncertzale.lv/kino-cesis"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={Fav3} alt="Kino cesis icon" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
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
