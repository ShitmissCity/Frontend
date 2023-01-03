import React, { createContext, createElement, useContext, PropsWithChildren, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";

const modalContext = createContext<{
    openModal: (header: ReactNode, body: ReactNode, footer?: ReactNode, redirect?: string) => void,
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
    const [body, setBody] = React.useState<ReactNode>(null);
    const [footer, setFooter] = React.useState<ReactNode>(null);
    const [header, setHeader] = React.useState<ReactNode>(null);
    const [redirect, setRedirect] = React.useState<string>(null);
    const navigate = useNavigate();

    function openModal(header: ReactNode, body: ReactNode, footer?: ReactNode, redirect?: string) {
        if (typeof (body) === "string")
            setBody(<p>{body}</p>);
        else
            setBody(body);
        if (typeof (header) === "string")
            setHeader(<h3>{header}</h3>);
        else
            setHeader(header);
        if (redirect) {
            setRedirect(redirect);
        }
        if (!footer) {
            setFooter(<button className="btn btn-primary" onClick={closeModal}>Close</button>);
        }
        else
            setFooter(footer);
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
                        {header}
                    </div>
                    {!!body && <div className="modal-body">
                        {body}
                    </div>}
                    <div className="modal-footer">
                        {footer}
                    </div>
                </div>
            </div>
        </div>
        <div className={"modal-backdrop fade" + (show ? " show" : "")} style={{ zIndex: 80000, transition: "opacity 0.3s ease-out", pointerEvents: show ? "auto" : "none" }} />
    </>
    );
}