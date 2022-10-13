import { createContext, PropsWithChildren, useContext, useState, createElement, useEffect } from "react";
import { User } from "../entity";
import { useRequest } from "./Request";
import { useCookie } from "./Cookie";

const authContext = createContext<{
    login: () => void,
    logout: () => void,
    isLoggedIn: boolean,
    user: User | undefined
    getUsername: () => string
}>({
    login: () => { },
    logout: () => { },
    isLoggedIn: false,
    user: undefined,
    getUsername: () => { return ""; }
});

export function useAuth() {
    return useContext(authContext);
}

export default function Auth(props: PropsWithChildren) {
    const [user, setUser] = useState<User>(null);
    const request = useRequest();
    const cookie = useCookie();

    function login() {
        request.getUrl("/authorized/user/me").then(response => {
            if (response.ok) {
                response.json().then(user => {
                    setUser(user);
                });
            }
            else {
                let token = cookie.getCookie("refreshToken");
                if (token)
                    update(token);
                else
                    logout();
            }
        });
    }

    function logout() {
        cookie.deleteMultipleCookies(["accessToken", "refreshToken"]);
        setUser(null);
    }

    function getUsername() {
        return user?.username;
    }

    function update(value: string) {
        if (value != null) {
            request.getUrl('/auth/token', { method: "POST", body: JSON.stringify({ token: value }), headers: { 'content-type': 'application/json' } }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        request.setAuthorizationHeader("JWT " + data.accessToken);
                        cookie.setMultipleCookies([
                            { name: "accessToken", value: data.accessToken, ttl: 60 * 15 },
                            { name: "refreshToken", value: data.refreshToken, ttl: 60 * 60 * 24 * 7 }
                        ]);
                    });
                }
            });
        }
    }

    useEffect(() => {
        var initId = cookie.onCookieChange("init", (cookies) => {
            if (user == null) {
                update(cookies["refreshToken"]?.value);
            }
        })
        var accessId = cookie.onCookieChange("accessToken", (value) => {
            if (user != null && value) {
                setTimeout(() => {
                    login();
                }, 200);
            }
        });

        return () => {
            cookie.removeListener("init", initId);
            cookie.removeListener("accessToken", accessId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setUser]);

    return createElement(authContext.Provider, {
        value: {
            login,
            logout,
            isLoggedIn: user != null,
            user,
            getUsername
        },
        children: props.children
    });
}