import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { setCookie } from "../components/Cookie";
import { useModal } from "../components/Modal";
import { useRequest } from "../components/Request";
import Loader from "../components/Loader";
import { useAuth } from "../components/Auth";
import { useNavigate } from "react-router";

export default function Login() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [render, setRender] = useState<React.ReactNode>(<Loader />);
    const request = useRequest();
    const redirect = useNavigate();
    const modal = useModal();
    const { login } = useAuth();

    useEffect(() => {
        const uuid = searchParams.get("uuid");
        request.getUrl('/auth?uuid=' + uuid).then(response => {
            setRender(<></>);
            if (response.ok) {
                response.json().then((json: { accessToken: string, refreshToken: string }) => {
                    request.setAuthorizationHeader("JWT " + json.accessToken);
                    setCookie("accessToken", json.accessToken, 60 * 15);
                    setCookie("refreshToken", json.refreshToken, 60 * 60 * 24 * 7);
                    login();
                    redirect("/");
                });
            }
            else {
                if (response.status === 401) {
                    response.text().then((text: string) => {
                        modal.openModal("Login failed", text, undefined, "/");
                    });
                }
                else {
                    modal.openModal("Login failed", "Please try again later.", undefined, "/");
                }
            }
        }).catch(() => {
            setRender(<></>);
            modal.openModal("Login failed", "Please try again later.", undefined, "/");
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setSearchParams]);
    return <>
        {render}
    </>;
}