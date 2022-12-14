import React, { createContext, createElement, PropsWithChildren, useContext } from "react";
import { merge } from "lodash";

const requestContext = createContext<{
    getUrl(url_segment: string, init?: RequestInit): Promise<Response>,
    setAuthorizationHeader(token: string): void
}>({
    getUrl: async () => { throw new Error("No request context provided") },
    setAuthorizationHeader: (token: string) => { }
});

let authorizationHeader: string | undefined = undefined;

export function useRequest() {
    return useContext(requestContext);
}

export default function Request(params: PropsWithChildren) {

    function getUrl(url_segment: string, init: RequestInit = { method: "GET" }): Promise<Response> {
        var url = process.env.REACT_APP_REQUEST_URL + url_segment;

        return fetch(url, merge(init, { headers: { Authorization: authorizationHeader } }));
    }

    return createElement(requestContext.Provider, {
        value: {
            getUrl: getUrl,
            setAuthorizationHeader: (token: string) => {
                authorizationHeader = token;
            }
        },
        children: params.children
    });
}