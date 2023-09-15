import React, { useContext, createContext, createRef, PropsWithChildren, useState, RefObject, useEffect } from "react";
import { Toast } from "bootstrap";

export enum ToastType {
    Error = "bs-danger",
    Info = "bs-info",
    Success = "bs-success",
    Warning = "bs-warning",
}

const ToastContext = createContext({
    showToast: (message: string, system: string, type: ToastType = ToastType.Info) => { },
});

export const useToast = () => useContext(ToastContext);

export default function ToastComponent(props: PropsWithChildren) {
    const [toasts, setToasts] = useState<{ element: JSX.Element, ref: RefObject<HTMLDivElement>, active: boolean }[]>([]);

    function show(message: string, system: string, type: ToastType = ToastType.Info) {
        let toast = ToastBody(message, system, createRef<HTMLDivElement>(), type);
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

var lut: string[] = []; for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }

function e7() {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[(d0 >> 8) & 0xff] + lut[(d0 >> 16) & 0xff] + lut[(d0 >> 24) & 0xff] + '-' +
        lut[d1 & 0xff] + lut[(d1 >> 8) & 0xff] + '-' + lut[((d1 >> 16) & 0x0f) | 0x40] + lut[(d1 >> 24) & 0xff] + '-' +
        lut[(d2 & 0x3f) | 0x80] + lut[(d2 >> 8) & 0xff] + '-' + lut[(d2 >> 16) & 0xff] + lut[(d2 >> 24) & 0xff] +
        lut[d3 & 0xff] + lut[(d3 >> 8) & 0xff] + lut[(d3 >> 16) & 0xff] + lut[(d3 >> 24) & 0xff];
}

function ToastBody(message: string, system: string, ref: RefObject<HTMLDivElement>, type: ToastType = ToastType.Info) {
    return {
        element: (<div className="toast" role="alert" aria-live="assertive" aria-atomic="true" ref={ref} key={e7()}>
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