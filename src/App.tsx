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

export default function App() {
    const { isLoggedIn, user } = useAuth();

    return (
        <Routes>
            <Route path="/teams" element={<Teams />} />
            <Route path="/map-pools" element={<MapPool />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/login" element={<Login />} />
            {isLoggedIn && user.role != null && (user.role.permissions & Permission.Admin) == Permission.Admin && (<Route path="/admin" element={<Admin />} />)}
            <Route path="*" element={<Home />} />
        </Routes>
    );
}