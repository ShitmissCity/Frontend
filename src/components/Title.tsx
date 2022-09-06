import { createContext, createElement, PropsWithChildren, useContext } from "react";

const titleContext = createContext({
    setTitle: (title: string) => { }
})

export function useTitle() {
    return useContext(titleContext);
}

export default function Title(props: PropsWithChildren) {
    function setTitle(title: string) {
        document.title = title + " | Shitmiss City";
    }

    return createElement(titleContext.Provider, {
        value: { setTitle },
        children: props.children
    });
}