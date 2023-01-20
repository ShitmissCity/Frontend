import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import { useAuth } from "./components/Auth";
import { Permission } from "./entity/User";
const Home = lazy(() => import("./pages/Home"));
const MapPool = lazy(() => import("./pages/MapPool"));
const Staff = lazy(() => import("./pages/Staff"));
const Login = lazy(() => import("./pages/Login"));
const Teams = lazy(() => import("./pages/Teams"));
const Admin = lazy(() => import("./pages/Admin"));
const Settings = lazy(() => import("./pages/Settings"));

export default function App() {
    const { isLoggedIn, user } = useAuth();

    return (
        <Routes>
            <Route path="/teams" element={<Teams />} />
            <Route path="/mappools" element={<MapPool />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/login" element={<Login />} />
            {isLoggedIn && user.role != null && Permission.isRole(user.role.permissions, Permission.MapPooler) && (<Route path="/admin" element={<Admin />} />)}
            {isLoggedIn && (<Route path="/settings" element={<Settings />} />)}
            <Route path="*" element={<Home />} />
        </Routes>
    );
}