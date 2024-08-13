import { createContext, PropsWithChildren, useContext, useState, createElement, useEffect } from "react";
import { User } from "../entity";
import { useRequest } from "./Request";
import { deleteCookie, getCookie, setCookie } from "./Cookie";
import { useToast } from "./Toast";

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
export const AuthTokenTime = 8 * 60 * 60;

export default function Auth(props: PropsWithChildren) {
    const [user, setUser] = useState<User>(null);
    const request = useRequest();
    const { showToast } = useToast();

    function login() {
        request.getUrl("/authorized/user/me").then(response => {
            if (response.ok) {
                response.json().then((user: User) => {
                    showToast("Logged in as " + user.username, "Auth");
                    setUser(user);
                });
            }
            else {
                if (count > 5) {
                    logout(true);
                    return;
                }
                count++;
                let token = getCookie("accessToken");
                if (token)
                    update(token.value);
                else
                    logout(true);
            }
        });
    }

    function logout(internal = false) {
        if (internal)
            showToast("Logged out", "Auth");
        else
            showToast("Logged out due to internal errors", "Auth");
        deleteCookie("accessToken");
        request.setAuthorizationHeader(undefined);
        setUser(null);
    }

    function getUsername() {
        return user?.username;
    }

    function update(value: string) {
        if (value != null) {
            request.setAuthorizationHeader("Bearer " + value);
            request.getUrl('/auth/refresh', { method: "POST", headers: { 'content-type': 'application/json' } }).then(response => {
                if (response.ok) {
                    response.text().then(data => {
                        request.setAuthorizationHeader("Bearer " + data);
                        setCookie("accessToken", data, AuthTokenTime);
                        if (!user)
                            login();
                    });
                }
            });
        }
    }

    useEffect(() => {
        let token = getCookie("accessToken");
        if (token)
            update(token.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setUser]);

    useEffect(() => {
        const interval = setInterval(() => {
            let token = getCookie("accessToken");
            if (token)
                update(token.value);
        }, AuthTokenTime - 60);
        return () => clearInterval(interval);
    }, []);

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