import { createContext, PropsWithChildren, useContext, useState, createElement, useEffect } from "react";
import { User } from "../entity";
import { useRequest } from "./Request";
import { deleteCookie, getCookie, setCookie } from "./Cookie";

const authContext = createContext<{
    login: () => void,
    logout: () => void,
    isLoggedIn: boolean,
    user: User | undefined,
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

let count = 1;

export default function Auth(props: PropsWithChildren) {
    const [user, setUser] = useState<User>(null);
    const request = useRequest();

    function login() {
        request.getUrl("/authorized/user/me").then(response => {
            if (response.ok) {
                response.json().then(user => {
                    setUser(user);
                });
            }
            else {
                if (count > 5) {
                    logout();
                    return;
                }
                count++;
                let token = getCookie("refreshToken");
                if (token)
                    update(token.value);
                else
                    logout();
            }
        });
    }

    function logout() {
        deleteCookie("refreshToken");
        deleteCookie("accessToken");
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
                        setCookie("accessToken", data.accessToken, 60 * 15);
                        setCookie("refreshToken", data.refreshToken, 60 * 60 * 24 * 7);
                        if (!user)
                            login();
                    });
                }
            });
        }
    }

    useEffect(() => {
        let token = getCookie("refreshToken");
        if (token)
            update(token.value);
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