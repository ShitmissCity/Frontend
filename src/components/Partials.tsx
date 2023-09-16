import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { brands, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import LoginButton from "./LoginButton";
import "./Partials.scss";
import { useAuth } from "./Auth";
import { Permission, User } from "../entity/User";
import Tooltip from "./Tooltip";

export function Footer() {
    return (
        <footer className="footer footer-color" style={{ marginTop: "auto" }}>
            <div className="container">
                <div className="d-flex justify-content-center">
                    <h6 className="theme-color">
                        Website built by the <b>Shitmiss</b> Dev Team for Shitmiss City {process.env.REACT_APP_YEAR}.
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

    const path = [
        { name: "Home", path: "/" },
        { name: "Teams", path: "/teams" },
        { name: "Map Pools", path: "/mappools" },
        { name: "Qualifiers", path: "/qualifiers" },
        { name: "Bracket", path: "/bracket" },
        { name: "Staff", path: "/staff" },
        {
            name: "Settings", path: "/settings", hidden: true, warn: (u: User) => {
                if (u.scoresaber_id === null || u.twitch_name === null)
                    return (<FontAwesomeIcon icon={solid("warning")} />)
                return null;
            },
            tooltip: () => {
                if (user.scoresaber_id === null || user.twitch_name === null)
                    return "Missing ScoreSaber ID or Twitch Name";
                return null;
            }
        },
        { name: "Admin", path: "/admin", hidden: true, permissions: [Permission.Admin] },
    ];

    const updateButtons = useCallback(() => {
        // eslint-disable-next-line array-callback-return
        setButtons(path.map((item, index) => {
            if (!item.hidden) {
                return (<li className="nav-item" key={index}>
                    <Tooltip text={(item.tooltip && item.tooltip()) || ""}>
                        <Link className={`nav-link ${location.pathname === item.path ? "active" : ""}`} to={item.path} style={{ paddingTop: 21.5, paddingBottom: 21.5 }}>
                            {item.name} {item.warn && item.warn(user)}
                        </Link>
                    </Tooltip>
                </li>)
            }
            if (isLoggedIn && item.hidden && (item.permissions === undefined || (user.role != null && item.permissions.every(perm => Permission.isRole(user.role.permissions, perm))))) {
                return (<li className="nav-item" key={index}>
                    <Tooltip text={(item.tooltip && item.tooltip()) || ""}>
                        <Link className={`nav-link ${location.pathname === item.path ? "active" : ""}`} to={item.path} style={{ paddingTop: 21.5, paddingBottom: 21.5 }}>
                            {item.name} {item.warn && item.warn(user)}
                        </Link>
                    </Tooltip>
                </li>)
            }
        }));
    }, [isLoggedIn, location.pathname, path]);

    useEffect(() => {
        updateButtons();
    }, [isLoggedIn, location]);

    return (
        <nav className="header navbar is-primary p-0 d-block">
            <div className="animated navbar navbar-expand-xxl p-0 navbar-dark">
                <div className="navbar-brand">
                    <Link to="/" style={{ fontSize: 20, borderRadius: "4px 0 0 4px", padding: "0 0.5rem" }}>
                        <img src="img/logo-white.png" alt="Shitmiss City" style={{ marginRight: 10, borderRadius: 5, width: "6rem", maxHeight: "100%", maxWidth: "100%" }} />
                    </Link>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse me-auto" id="navbarCollapse">
                    <ul className="navbar-nav">
                        {buttons}
                    </ul>
                    <ul className="navbar-nav ms-auto me-xxl-2 d-flex flex-row">
                        <li className="nav-item me-xxl-2">
                            <LoginButton />
                        </li>
                        <li className="nav-item">
                            <a className="btn btn-dark" href="https://discord.gg/h58zp9f" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={brands('discord')} /><span style={{ marginLeft: 7 }}>Our Discord Server</span></a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}