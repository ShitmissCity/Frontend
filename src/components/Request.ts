import { createContext, createElement, PropsWithChildren, useContext, useEffect, useState } from "react";
import { merge } from "lodash";
import { ToastType, useToast } from "./Toast";

const requestContext = createContext<{
    getUrl(url_segment: string, init?: RequestInit): Promise<Response>,
    setAuthorizationHeader(token: string): void,
    scoresaberSvg: string
}>({
    getUrl: async () => { throw new Error("No request context provided") },
    setAuthorizationHeader: (token: string) => { },
    scoresaberSvg: ""
});

let authorizationHeader: string | undefined = undefined;

export function useRequest() {
    return useContext(requestContext);
}

export default function Request(params: PropsWithChildren) {
    const { showToast } = useToast();
    var [scoresaberSvg, setScoresaberSvg] = useState("");

    useEffect(() => {
        fetch("/img/scoresaber.svg").then(resp => resp.text()).then(setScoresaberSvg);
    }, []);

    async function getUrl(url_segment: string, init: RequestInit = { method: "GET" }): Promise<Response> {
        var url = process.env.REACT_APP_REQUEST_URL + url_segment;

        try {
            var resp = await fetch(url, merge(init, { headers: { Authorization: authorizationHeader } }));
        }
        catch (e) {
            showToast("An error occured during a request.", "Request", ToastType.Error);
            throw e;
        }

        return resp;
    }

    return createElement(requestContext.Provider, {
        value: {
            getUrl: getUrl,
            setAuthorizationHeader: (token: string) => {
                console.log("Setting authorization header to " + token);
                authorizationHeader = token;
            },
            scoresaberSvg: scoresaberSvg
        },
        children: params.children
    });
}