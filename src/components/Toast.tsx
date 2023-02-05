import React, { useContext, createContext, createRef, PropsWithChildren, useState, RefObject, useEffect } from "react";
import { Toast } from "bootstrap";

const ToastContext = createContext({
    showToast: (message: string, system: string, type: ToastType = ToastType.Info) => { },
});

export const useToast = () => useContext(ToastContext);

export default function ToastComponent(props: PropsWithChildren) {
    const [toasts, setToasts] = useState<{ element: JSX.Element, ref: RefObject<HTMLDivElement>, active: boolean }[]>([]);

    function show(message: string, system: string, type: ToastType = ToastType.Info) {
        let toast = ToastBody(message, system, createRef<HTMLDivElement>(), (t: RefObject<HTMLDivElement>) => {
            setToasts(toasts.filter(f => f.ref !== t));
        }, type);
        setToasts([...toasts, { ...toast, active: false }]);
    }

    function clean(t: RefObject<HTMLDivElement>) {
        setToasts(toasts.filter(f => f.ref !== t));
    }

    useEffect(() => {
        toasts.forEach(t => {
            if (!t.active) {
                let toast = new Toast(t.ref.current, { autohide: true, delay: 5000, animation: true });
                toast.show();
                t.ref.current.addEventListener("hidden.bs.toast", () => clean(t.ref));
                t.active = true;
            }
        });
    }, [toasts]);

    return (
        <ToastContext.Provider value={{ showToast: show }}>
            {props.children}
            <div className="fixed-bottom">
                <div className="toast-container bottom-0 end-0 p-3">
                    {toasts.map(t => t.element)}
                </div>
            </div>
        </ToastContext.Provider>
    );
}

function ToastBody(message: string, system: string, ref: RefObject<HTMLDivElement>, removed: (t: RefObject<HTMLDivElement>) => void, type: ToastType = ToastType.Info) {
    return {
        element: (<div className="toast" role="alert" aria-live="assertive" aria-atomic="true" ref={ref} key={crypto.randomUUID()}>
            <div className="toast-header">
                <div style={{ backgroundColor: `var(--${type})`, width: 22, height: 22 }} className="rounded me-2" />
                <strong className="me-auto">{system}</strong>
                <small className="text-muted">{new Date(Date.now()).toLocaleDateString(window.navigator.languages, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</small>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>),
        ref: ref
    }
}

export enum ToastType {
    Error = "bs-danger",
    Info = "bs-info",
    Success = "bs-success",
    Warning = "bs-warning",
}