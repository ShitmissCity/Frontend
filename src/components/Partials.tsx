import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { brands, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import "./Partials.scss";

export function Footer() {
    return (
        <footer className="footer footer-color" style={{ marginTop: "auto" }}>
            <div className="content has-text-centered">
                <p className="theme-color">
                    Website built by the <b>Shitmiss Productions</b> Dev Team for Shitmiss City {process.env.REACT_APP_YEAR}.<br />
                    <img src="img/logo-alt.png" alt="Shitmiss City" style={{ marginTop: 25, borderRadius: 5, width: 256 }} />
                </p>
            </div>
        </footer>
    )
}

export function Header() {
    const location = useLocation();

    const loginUrl = "https://api.shitmiss.city/auth/login?callback=" + encodeURIComponent(window.location.origin) + "&env=" + process.env.REACT_APP_ENV;

    const path = [
        { name: "Home", path: "/" },
        // { name: "Player Signup", path: "/player/sign-up" }, // TODO: Add this back in when auth is implemented
        { name: "Teams", path: "/teams" },
        { name: "Map Pools", path: "/map-pools" },
        { name: "Qualifiers", path: "/qualifiers" },
        { name: "Bracket", path: "/bracket" },
        { name: "Staff", path: "/staff" }
    ];

    return (
        <nav className="is-primary header animated navbar">
            <div className="navbar-brand">
                <Link className="navbar-item" to="/" style={{ fontSize: 20, borderRadius: "4px 0 0 4px", padding: "0 0.5rem" }}>
                    <img src="img/logo-white.png" alt="Shitmiss City" style={{ marginRight: 10, borderRadius: 5, width: "6rem", maxHeight: "100%", maxWidth: "100%" }} />
                </Link>
            </div>
            <div className="navbar-menu">
                <div className="navbar-start">
                    {path.map((item, index) => (
                        <Link key={index} className={`navbar-item menu-btn ${location.pathname === item.path ? "active" : ""}`} to={item.path}>
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        {/* //TODO: Add user buttons when auth is done */}
                        <div className="buttons">
                            <a className="button button-color" href={loginUrl}><FontAwesomeIcon icon={solid('arrow-right-to-bracket')} /><span style={{ marginLeft: 7 }}>Login</span></a>
                            <a className="button button-color" href="https://discord.gg/h58zp9f" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={brands('discord')} /><span style={{ marginLeft: 7 }}>Our Discord Server</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}