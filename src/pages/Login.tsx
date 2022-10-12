import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCookie } from "../components/Cookie";
import { useModal } from "../components/Modal";
import { useRequest } from "../components/Request";
import Loader from "../components/Loader";

export default function Login() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [render, setRender] = useState<React.ReactNode>(<Loader />);
    const cookie = useCookie();
    const request = useRequest();
    const modal = useModal();

    useEffect(() => {
        const uuid = searchParams.get("uuid");
        request.getUrl('/auth?uuid=' + uuid).then(response => {
            setRender(<></>);
            if (response.ok) {
                response.json().then((json: { accessToken: string, refreshToken: string }) => {
                    request.setAuthorizationHeader("JWT " + json.accessToken);
                    cookie.setMultipleCookies([
                        { name: "accessToken", value: json.accessToken, ttl: 60 * 60 },
                        { name: "refreshToken", value: json.refreshToken, ttl: 60 * 60 * 24 * 7 }
                    ]);
                    window.location.href = "/";
                });
            }
            else {
                if (response.status === 401) {
                    response.text().then((text: string) => {
                        modal.openModal(
                            <div className="box app-background">
                                <h1 className="title">Login failed</h1>
                                <p className="subtitle">{text}</p>
                                <button className="button is-danger" onClick={modal.closeModal}>Dismiss</button>
                            </div>
                            , "/")
                    });
                }
                else {
                    modal.openModal(
                        <div className="box app-background">
                            <h1 className="title">Login failed</h1>
                            <p className="subtitle">Please try again later.</p>
                            <button className="button is-danger" onClick={modal.closeModal}>Dismiss</button>
                        </div>
                        , "/");
                }
            }
        }).catch(() => {
            setRender(<></>);
            modal.openModal(
                <div className="box app-background">
                    <h1 className="title">Login failed</h1>
                    <p className="subtitle">Please try again later.</p>
                    <button className="button is-danger" onClick={modal.closeModal}>Dismiss</button>
                </div>
                , "/");
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setSearchParams]);
    return <>
        {render}
    </>;
}