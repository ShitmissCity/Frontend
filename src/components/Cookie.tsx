import React, { createElement, createContext, PropsWithChildren, useEffect, useContext } from "react";

const cookieContext = createContext<{
    setCookie(name: string, value: string, ttl: number): void,
    setMultipleCookies(cookies: { name: string, value: string, ttl: number }[]): void,
    getCookie(name: string): string | undefined,
    deleteCookie(name: string): void,
    deleteMultipleCookies(names: string[]): void,
    onCookieChange(name: string, callback: (value?: any) => void): string,
    removeListener(name: string, id: string): void
}>({
    setCookie: (name, value, ttl) => { },
    setMultipleCookies: (cookies) => { },
    getCookie: (name) => { return undefined; },
    deleteCookie: (name) => { },
    deleteMultipleCookies: (names) => { },
    onCookieChange: (name, callback) => { return ""; },
    removeListener: (name, id) => { }
});

export function useCookie() {
    return useContext(cookieContext);
}

export default function Cookie(props: PropsWithChildren) {
    const [cookies, setCookies] = React.useState<{ [name: string]: { value: string, ttl: Date } }>({});
    const [init, setInit] = React.useState(true);
    const [listeners, setListeners] = React.useState<{ [name: string]: { callback: ((value?: any) => void), id: string }[] }>({});

    function setCookie(name: string, value: string, ttl: number) {
        if (name.trim() === "init") {
            //error name is reserved
            return;
        }
        let date = new Date();
        date.setSeconds(date.getSeconds() + ttl);
        setCookies({ ...cookies, [name.trim()]: { value, ttl: date } });
    }

    function setMultipleCookies(cookiesInp: { name: string, value: string, ttl: number }[]) {
        let newCookies: { [name: string]: { value: string, ttl: Date } } = {};
        for (let cookie of cookiesInp) {
            if (cookie.name.trim() === "init") {
                //error name is reserved
                return;
            }
            let date = new Date();
            date.setSeconds(date.getSeconds() + cookie.ttl);
            newCookies[cookie.name.trim()] = { value: cookie.value, ttl: date };
        }
        setCookies({ ...cookies, ...newCookies });
    }

    function updateCookies() {
        for (let name in cookies) {
            if (cookies[name].ttl < new Date()) {
                delete cookies[name];
            }
        }
        setCookies(cookies);
    }

    function getCookie(name: string) {
        updateCookies();
        return cookies[name.trim()]?.value;
    }

    function deleteCookie(name: string) {
        updateCookies();
        delete cookies[name.trim()];
        document.cookie = name.trim() + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setCookies(cookies);
    }

    function deleteMultipleCookies(names: string[]) {
        updateCookies();
        for (let name of names) {
            delete cookies[name.trim()];
            document.cookie = name.trim() + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        setCookies(cookies);
    }

    function onCookieChange(name: string, callback: (value: string) => void) {
        if (listeners[name] == null) {
            listeners[name.trim()] = [];
        }
        var id = crypto.randomUUID();
        listeners[name.trim()].push({ callback, id });
        setListeners(listeners);
        return id;
    }

    function removeListener(name: string, id: string) {
        if (listeners[name.trim()] == null) {
            return;
        }
        listeners[name.trim()] = listeners[name.trim()].filter((listener) => listener.id !== id);
        setListeners(listeners);
    }

    useEffect(() => {
        if (Object.keys(cookies).length === 0 && init) {
            return;
        }
        for (let name in cookies) {
            document.cookie = name.trim() + "=" + cookies[name.trim()].value + "; expires=" + cookies[name.trim()].ttl.toUTCString();
            document.cookie = name.trim() + "_expire=" + cookies[name.trim()].ttl.toUTCString() + "; expires=" + cookies[name.trim()].ttl.toUTCString();
            listeners[name.trim()]?.forEach(listener => listener.callback(cookies[name].value));
        }
        if (init) {
            setInit(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookies]);

    useEffect(() => {
        let interval: null | string | number | NodeJS.Timer = null;
        if (!init) {
            listeners["init"]?.forEach(listener => listener.callback(cookies));
            interval = setInterval(() => {
                updateCookies();
            }, 1000)
        }
        return () => {
            if (interval != null) {
                clearInterval(interval);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [init]);

    useEffect(() => {
        let cookieString = document.cookie.split(";");
        let newCookies: { [name: string]: { value: string, ttl: Date } } = {};
        for (let cookie of cookieString.filter(t => t && !t[0].includes("_expire"))) {
            let [name, value] = cookie.split("=");
            let expire = cookieString.find(t => t.includes(name.trim() + "_expire"));
            if (expire) {
                let [, expireDate] = expire.split("=");
                newCookies[name.trim()] = { value, ttl: new Date(expireDate) };
            }
        }
        setCookies(newCookies);
    }, [setCookies]);

    return createElement(cookieContext.Provider, {
        children: props.children,
        value: {
            setCookie,
            setMultipleCookies,
            getCookie,
            deleteCookie,
            deleteMultipleCookies,
            onCookieChange,
            removeListener
        }
    })
}