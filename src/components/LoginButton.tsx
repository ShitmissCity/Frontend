import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useAuth } from "./Auth";
import { deleteCookie } from "./Cookie";

export default function LoginButton() {
    const { isLoggedIn } = useAuth();

    function logout() {
        deleteCookie("refreshToken");
        deleteCookie("accessToken");
        window.location.reload();
    }

    const loginUrl = `${process.env.REACT_APP_REQUEST_URL}/auth/login?callback=${encodeURIComponent(process.env.REACT_APP_REQUEST_URL + "/callback")}&env=${process.env.REACT_APP_ENV}`;
    if (isLoggedIn)
        return (
            <a className="btn btn-dark" onClick={() => logout()}>
                <FontAwesomeIcon icon={solid('sign-out-alt')} />
            </a>
        );
    else
        return (
            <a className="btn btn-dark" href={loginUrl}><FontAwesomeIcon icon={solid('sign-in-alt')} /><span style={{ marginLeft: 7 }}>Login</span></a>
        );
}