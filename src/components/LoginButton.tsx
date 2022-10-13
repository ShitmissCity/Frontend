import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useAuth } from "./Auth";

export default function LoginButton() {
    const { user, isLoggedIn, logout } = useAuth();

    const loginUrl = `${process.env.REACT_APP_REQUEST_URL}/auth/login?callback=${encodeURIComponent(process.env.REACT_APP_REQUEST_URL + "/callback")}&env=${process.env.REACT_APP_ENV}`;
    if (isLoggedIn)
        return (
            <a className="button button-color" onClick={logout}>
                <FontAwesomeIcon icon={solid('sign-out-alt')} />
            </a>
        );
    else
        return (
            <a className="button button-color" href={loginUrl}><FontAwesomeIcon icon={solid('sign-in-alt')} /><span style={{ marginLeft: 7 }}>Login</span></a>
        );
}