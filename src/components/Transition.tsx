import React from "react";

export default function Transition(props: { children: React.ReactNode, in: boolean, timeout: number, classNames: string, doFade?: boolean }) {
    const [show, setShow] = React.useState(false);
    const [prevChildren, setPrevChildren] = React.useState<React.ReactNode>(props.children);

    var timeout: NodeJS.Timeout;

    React.useEffect(() => {
        if (props.in) {
            setPrevChildren(props.children);
            setShow(true);
            timeout = setTimeout(() => {
                setShow(false);
            }, props.timeout);
        } else {
            setShow(true);
            timeout = setTimeout(() => {
                setShow(false);
            }, props.timeout);
        }
    }, [props.in]); // eslint-disable-line

    React.useEffect(() => {
        if (props.doFade) {
            setPrevChildren(props.children);
            setShow(true);
            timeout = setTimeout(() => {
                setShow(false);
            }, props.timeout);
        }
    }, [props.children]);

    return (
        <div className={props.classNames + " " + (show && (props.doFade ?? true) ? `${props.in ? props.classNames + "-enter" : props.classNames + "-exit"}` : (props.doFade ?? true ? "" : props.classNames + "-enter"))}>
            {prevChildren}
        </div>
    );
}