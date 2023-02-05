import { createContext, createElement, PropsWithChildren, useContext } from "react";
import { merge } from "lodash";
import { ToastType, useToast } from "./Toast";

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
    const { showToast } = useToast();

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
                authorizationHeader = token;
            }
        },
        children: params.children
    });
}