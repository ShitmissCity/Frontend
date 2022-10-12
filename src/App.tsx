import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
const Home = lazy(() => import("./pages/Home"));
const MapPool = lazy(() => import("./pages/MapPool"));
const Staff = lazy(() => import("./pages/Staff"));
const Login = lazy(() => import("./pages/Login"));

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map-pools" element={<MapPool />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}