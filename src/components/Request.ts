import React, { createContext, createElement, PropsWithChildren, useContext } from "react";
import { merge } from "lodash";

const requestContext = createContext<{
    getUrl(url_segment: string, init?: RequestInit): Promise<Response>,
    setAuthorizationHeader(token: React.SetStateAction<string>): void
}>({
    getUrl: async () => { throw new Error("No request context provided") },
    setAuthorizationHeader: (token: React.SetStateAction<string>) => { }
});

export function useRequest() {
    return useContext(requestContext);
}

export default function Request(params: PropsWithChildren) {
    const [authorization, setAuthorization] = React.useState("");

    function getUrl(url_segment: string, init: RequestInit = {}): Promise<Response> {
        var url = process.env.REACT_APP_REQUEST_URL + url_segment;

        return fetch(url, merge(init, { headers: { Authorization: authorization } }));
    }

    return createElement(requestContext.Provider, {
        value: {
            getUrl: getUrl,
            setAuthorizationHeader: setAuthorization
        },
        children: params.children
    });
}