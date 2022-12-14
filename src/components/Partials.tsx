import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { brands, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import LoginButton from "./LoginButton";
import "./Partials.scss";
import { useAuth } from "./Auth";
import { Permission } from "../entity/User";

export function Footer() {
    return (
        <footer className="footer footer-color" style={{ marginTop: "auto" }}>
            <div className="container">
                <div className="d-flex justify-content-center">
                    <h6 className="theme-color">
                        Website built by the <b>Shitmiss Productions</b> Dev Team for Shitmiss City {process.env.REACT_APP_YEAR}.
                    </h6>
                </div>
                <div className="d-flex justify-content-center">
                    <img src="img/logo-alt.png" alt="Shitmiss City" style={{ marginTop: 25, borderRadius: 5, width: 256 }} />
                </div>
            </div>
        </footer>
    )
}

export function Header() {
    const [buttons, setButtons] = useState<JSX.Element[]>([]);
    const location = useLocation();
    const { user, isLoggedIn } = useAuth();

    const loginUrl = `${process.env.REACT_APP_REQUEST_URL}/auth/login?callback=${encodeURIComponent(process.env.REACT_APP_REQUEST_URL + "/callback")}&env=${process.env.REACT_APP_ENV}`;

    const path = [
        { name: "Home", path: "/" },
        // { name: "Player Signup", path: "/player/sign-up" }, // TODO: Add this back in when auth is implemented
        { name: "Teams", path: "/teams" },
        { name: "Map Pools", path: "/map-pools" },
        { name: "Qualifiers", path: "/qualifiers" },
        { name: "Bracket", path: "/bracket" },
        { name: "Staff", path: "/staff" },
        { name: "Admin", path: "/admin", hidden: true },
    ];

    const updateButtons = useCallback(() => {
        setButtons(path.map((item, index) => {
            if (!item.hidden) {
                return (<li className="nav-item" key={index}>
                    <Link className={`nav-link ${location.pathname === item.path ? "active" : ""}`} to={item.path} style={{ paddingTop: 21.5, paddingBottom: 21.5 }}>
                        {item.name}
                    </Link>
                </li>)
            }
            if (isLoggedIn && user.role != null && (user.role.permissions & Permission.Admin) == Permission.Admin && item.hidden) {
                return (<li className="nav-item" key={index}>
                    <Link className={`nav-link ${location.pathname === item.path ? "active" : ""}`} to={item.path} style={{ paddingTop: 21.5, paddingBottom: 21.5 }}>
                        {item.name}
                    </Link>
                </li>)
            }
        }));
    }, [isLoggedIn, location.pathname, path]);

    useEffect(() => {
        updateButtons();
    }, [isLoggedIn, location]);

    return (
        <nav className="header animated navbar navbar-expand-lg is-primary p-0 navbar-dark">
            <div className="navbar-brand">
                <Link to="/" style={{ fontSize: 20, borderRadius: "4px 0 0 4px", padding: "0 0.5rem" }}>
                    <img src="img/logo-white.png" alt="Shitmiss City" style={{ marginRight: 10, borderRadius: 5, width: "6rem", maxHeight: "100%", maxWidth: "100%" }} />
                </Link>
            </div>
            <div className="collapse navbar-collapse me-auto">
                <ul className="navbar-nav">
                    {buttons}
                </ul>
                <ul className="navbar-nav ms-auto me-2">
                    {/* //TODO: Add user buttons when auth is done */}
                    <li className="navbar-item me-2">
                        <LoginButton />
                    </li>
                    <li className="navbar-item">
                        <a className="btn btn-dark" href="https://discord.gg/h58zp9f" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={brands('discord')} /><span style={{ marginLeft: 7 }}>Our Discord Server</span></a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}