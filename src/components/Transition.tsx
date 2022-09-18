import React from "react";

export default function Transition(props: { children: React.ReactNode, in: boolean, timeout: number, classNames: string }) {
    const [show, setShow] = React.useState(false);
    const [prevChildren, setPrevChildren] = React.useState<React.ReactNode>(props.children);

    React.useEffect(() => {
        if (props.in) {
            setPrevChildren(props.children);
            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, props.timeout);
        } else {
            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, props.timeout);
        }
    }, [props.in]); // eslint-disable-line

    return (
        <div className={props.classNames + " " + (show ? `${props.in ? props.classNames + "-enter" : props.classNames + "-exit"}` : "")}>
            {prevChildren}
        </div>
    );
}