import React, { createContext, createElement, useContext, PropsWithChildren, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

const modalContext = createContext<{
    openModal: (header: string, body: string, redirect?: string) => void,
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
    const [display, setDisplay] = React.useState<boolean>(false);
    const [show, setShow] = React.useState<boolean>(false);
    const [body, setBody] = React.useState<string>(null);
    const [header, setHeader] = React.useState<string>(null);
    const [redirect, setRedirect] = React.useState<string>(null);
    const navigate = useNavigate();

    function openModal(header: string, body: string, redirect?: string) {
        setBody(body);
        setHeader(header);
        if (redirect) {
            setRedirect(redirect);
        }
        setShow(true);
    }

    function closeModal() {
        if (redirect) {
            navigate(redirect);
            setRedirect(null);
        }
        setTimeout(() => {
            setBody(null);
            setHeader(null);
        }, 300);
        setShow(false);
    }

    useEffect(() => {
        if (!show)
            setTimeout(() => {
                setDisplay(show);
            }, 300);
        else
            setDisplay(show);
    });

    return createElement(modalContext.Provider, {
        value: { openModal, closeModal, setRedirect },
    }, <>
        {props.children}
        <div className={"modal fade" + (show ? " show" : "")} style={{ display: display ? "block" : "none", zIndex: 90000, opacity: show ? 1 : 0, transition: "opacity 0.3s ease-out" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>
                            {header}
                        </h3>
                    </div>
                    <div className="modal-body">
                        <p>
                            {body}
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary" onClick={closeModal}>Close</button>
                    </div>
                </div>
            </div>
        </div>
        <div className={"modal-backdrop fade" + (show ? " show" : "")} style={{ zIndex: 80000, transition: "opacity 0.3s ease-out", pointerEvents: show ? "auto" : "none" }} />
    </>
    );
}