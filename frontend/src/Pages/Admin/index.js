import React, { useEffect, useState } from "react";
import NavPadding from "../../Reuse/Components/NavPadding";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";

import "../../CSS/Admin.scss";

import { useQuery } from "@tanstack/react-query";
import Get from "../../Database/API/Get";
import Post from "../../Database/API/Post";
import Delete from "../../Database/API/Delete";

import Events from "./Events";
import Genres from "./Genres";
import AgeRatings from "./AgeRatings";
import LoadingScreen from "../../Reuse/Components/LoadingScreen";
import Input from "../../Reuse/Components/Input";

export default function Admin() {
    const navigate = useNavigate();

    // AUTH
    const checkAuth = () => {
        if (!sessionStorage.getItem("token")) {
            navigate("/");
        }
    };
    useEffect(() => {
        checkAuth();
    }, []);

    // NAVIGATION
    const [currentView, setcurrentView] = useState("events");

    // MODALS
    const [isFormSubmitting, setisFormSubmitting] = useState(false);
    const [isDeleting, setisDeleting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [messageNotice, setmessageNotice] = useState(null);

    const [createEventModal, setCreateEventModal] = useState(false);
    const [createGenreModal, setCreateGenreModal] = useState(false);
    const [createAgeRatingModal, setCreateAgeRatingModal] = useState(false);

    const decideModalToggle = () => {
        setFormErrors({});
        switch (currentView) {
            case "events":
                setCreateEventModal(!createEventModal);
                break;

            case "genres":
                setCreateGenreModal(!createGenreModal);
                break;

            case "ageRatings":
                setCreateAgeRatingModal(!createAgeRatingModal);
                break;
        }
    };

    // FORMS
    const submitForm = async (e) => {
        e.preventDefault();
        setisFormSubmitting(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        const token = sessionStorage.getItem("token");
        const result = await Post(currentView, token, data);
        console.log(result);
        setisFormSubmitting(false);
        if (result.errors || result.message) {
            if (result.message) {
                decideModalToggle();
                await refetchEvents();
                await refetchOptions();
                setmessageNotice(result.message);
            } else {
                console.log(result.errors);
                setFormErrors(result.errors);
            }
        } else {
            decideModalToggle();
            await refetchEvents();
            await refetchOptions();
        }
    };

    useEffect(() => {
        if (messageNotice) {
            setTimeout(() => {
                setmessageNotice(null);
            }, 3000);
        }
    }, [messageNotice]);

    // QUERIES
    const {
        data: optionsData,
        isLoading: optionsisLoading,
        refetch: refetchOptions,
    } = useQuery({
        queryKey: ["events", "options"],
        queryFn: async () => {
            return await Get("events/options");
        },
    });

    const {
        data: eventsData,
        isLoading: eventsisLoading,
        refetch: refetchEvents,
    } = useQuery({
        queryKey: ["events", "admin"],
        queryFn: async () => {
            return await Get("events/all");
        },
    });

    const deleteOption = async (id) => {
        setisDeleting(id);
        const token = sessionStorage.getItem("token");
        const result = await Delete(currentView, token, id);
        setisDeleting(false);
        if (result.errors || result.message) {
            if (result.message) {
                await refetchOptions();
                setmessageNotice(result.message);
            } else {
                console.log(result.errors);
                setFormErrors(result.errors);
            }
        } else {
            await refetchOptions();
        }
    };

    if (optionsisLoading || eventsisLoading) return <LoadingScreen />;

    return (
        <div>
            <NavPadding />
            <div className="message-feedback">
                <p className={messageNotice ? "message-active" : ""}>
                    {messageNotice}
                </p>
            </div>
            <ReactModal
                isOpen={createEventModal}
                onRequestClose={decideModalToggle}
                overlayClassName="login-modal-overlay"
                className="login-modal-content"
                closeTimeoutMS={300}
            >
                <h2>Create Event</h2>
                <form className="form" onSubmit={submitForm}>
                    <div className="input-grid">
                        <div className="date-time">
                            <Input
                                name="date"
                                type="date"
                                error={formErrors.date ? formErrors.date : ""}
                            />
                            <Input
                                name="time"
                                type="time"
                                error={formErrors.time ? formErrors.time : ""}
                            />
                            <Input
                                name="length"
                                type="number"
                                error={
                                    formErrors.length ? formErrors.length : ""
                                }
                            />
                        </div>
                        <div className="general">
                            <Input
                                name="name"
                                type="text"
                                error={formErrors.name ? formErrors.name : ""}
                            />
                            <Input
                                name="description"
                                type="text"
                                error={
                                    formErrors.description
                                        ? formErrors.description
                                        : ""
                                }
                            />
                            <Input
                                name="file"
                                displayName="image"
                                type="file"
                                error={formErrors.file ? formErrors.file : ""}
                            />
                        </div>
                        <div className="seats">
                            <Input
                                name="max_cols"
                                displayName="max columns"
                                type="number"
                                error={
                                    formErrors.max_cols
                                        ? formErrors.max_cols
                                        : ""
                                }
                            />
                            <Input
                                name="max_rows"
                                displayName="max rows"
                                type="number"
                                error={
                                    formErrors.max_rows
                                        ? formErrors.max_rows
                                        : ""
                                }
                            />
                        </div>
                        <div className="filtering">
                            <Input
                                name="genre_id"
                                displayName="genre"
                                type="select"
                                options={optionsData.genres}
                                error={
                                    formErrors.genre_id
                                        ? formErrors.genre_id
                                        : ""
                                }
                            />
                            <Input
                                name="age_rating_id"
                                displayName="age rating"
                                type="select"
                                options={optionsData.age_ratings}
                                error={
                                    formErrors.age_rating_id
                                        ? formErrors.age_rating_id
                                        : ""
                                }
                            />
                        </div>
                    </div>
                    <button className="flex-button" type="sumbit">
                        {isFormSubmitting ? (
                            <i className="bi bi-arrow-clockwise small-loading-anim"></i>
                        ) : (
                            "Create"
                        )}
                    </button>
                </form>
            </ReactModal>
            <ReactModal
                isOpen={createGenreModal}
                onRequestClose={decideModalToggle}
                overlayClassName="login-modal-overlay"
                className="login-modal-content"
                closeTimeoutMS={300}
            >
                <h2>Create Genre</h2>
                <form className="form" onSubmit={submitForm}>
                    <div className="date-time">
                        <Input
                            name="name"
                            placeholder="Comedy..."
                            error={formErrors.name ? formErrors.name : ""}
                        />
                    </div>
                    <button className="flex-button" type="sumbit">
                        {isFormSubmitting ? (
                            <i className="bi bi-arrow-clockwise small-loading-anim"></i>
                        ) : (
                            "Create"
                        )}
                    </button>
                </form>
            </ReactModal>
            <ReactModal
                isOpen={createAgeRatingModal}
                onRequestClose={decideModalToggle}
                overlayClassName="login-modal-overlay"
                className="login-modal-content"
                closeTimeoutMS={300}
            >
                <h2>Create Age Rating</h2>
                <form className="form" onSubmit={submitForm}>
                    <div className="date-time">
                        <Input
                            name="name"
                            displayName="rating"
                            placeholder="+7..."
                            error={formErrors.name ? formErrors.name : ""}
                        />
                    </div>
                    <button className="flex-button" type="sumbit">
                        {isFormSubmitting ? (
                            <i className="bi bi-arrow-clockwise small-loading-anim"></i>
                        ) : (
                            "Create"
                        )}
                    </button>
                </form>
            </ReactModal>
            <main className="side-bar-view">
                <div className="side-bar">
                    <div className="selections">
                        <button
                            onClick={() => {
                                setcurrentView("events");
                            }}
                            className={
                                currentView === "events" ? "selected" : ""
                            }
                        >
                            Events
                        </button>
                        <button
                            onClick={() => {
                                setcurrentView("genres");
                            }}
                            className={
                                currentView === "genres" ? "selected" : ""
                            }
                        >
                            Genres
                        </button>
                        <button
                            onClick={() => {
                                setcurrentView("ageRatings");
                            }}
                            className={
                                currentView === "ageRatings" ? "selected" : ""
                            }
                        >
                            Age Ratings
                        </button>
                    </div>
                    <hr />
                    <h3>Statistics</h3>
                    {/* <p>Total Revenue:</p> */}
                    {/* <p>Total Reruns:</p> */}
                    {/* <p>Total Reviews:</p> */}
                    <p>Events: {eventsData.length}</p>
                    <p>Genres: {Object.keys(optionsData.genres).length}</p>
                    <p>
                        Age Ratings:{" "}
                        {Object.keys(optionsData.age_ratings).length}
                    </p>
                </div>
                <div className="side-bar-content-view gap-1">
                    <i
                        className="bi bi-patch-plus-fill create-new"
                        onClick={decideModalToggle}
                    ></i>
                    {currentView === "events" && (
                        <Events eventsData={eventsData} />
                    )}
                    {currentView === "genres" && (
                        <Genres
                            data={optionsData.genres}
                            deleteFn={deleteOption}
                            isDeleting={isDeleting}
                        />
                    )}
                    {currentView === "ageRatings" && (
                        <AgeRatings
                            data={optionsData.age_ratings}
                            deleteFn={deleteOption}
                            isDeleting={isDeleting}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
