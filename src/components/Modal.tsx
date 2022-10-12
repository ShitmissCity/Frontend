import React, { createContext, createElement, useContext, PropsWithChildren } from "react";

const modalContext = createContext<{
    openModal: (modal: React.ReactNode, redirect?: string) => void,
    closeModal: () => void,
    setRedirect: (redirect: string) => void
}>({
    openModal: (modal, redirect) => { },
    closeModal: () => { },
    setRedirect: (redirect) => { }
});

export function useModal() {
    return useContext(modalContext);
}

export default function Modal(props: PropsWithChildren) {
    const [modal, setModal] = React.useState<React.ReactNode>(null);
    const [redirect, setRedirect] = React.useState<string>(null);

    function openModal(modal: React.ReactNode, redirect?: string) {
        setModal(modal);
        if (redirect) {
            setRedirect(redirect);
        }
    }

    function closeModal() {
        if (redirect) {
            window.location.href = redirect;
            setRedirect(null);
        }
        setModal(null);
    }

    return createElement(modalContext.Provider, {
        value: { openModal, closeModal, setRedirect },
    }, <>
        {props.children}
        <div className={"modal" + (modal ? " is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-content app-background">
                {modal}
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
        </div>
    </>
    );
}