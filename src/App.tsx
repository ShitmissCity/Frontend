import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
const Home = lazy(() => import("./pages/Home"));

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />}/>
        </Routes>
    );
}