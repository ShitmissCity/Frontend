import React from "react";
import { Transition as CSSTransition, TransitionStatus } from "react-transition-group";

export default function Transition(props: { children: React.ReactNode, in: boolean, timeout: number, classNames: string, doFade?: boolean }) {
    const [prev, setPrev] = React.useState<React.ReactNode>(null);

    React.useEffect(() => {
        setTimeout(() => {
            setPrev(props.children);
        }, props.timeout);
    }, [props.in]);

    return (
        <CSSTransition
            in={props.in}
            timeout={props.timeout}>
            {(state) => (<div className={props.classNames + " " + props.classNames + "-" + state}>
                {prev}
            </div>)}

        </CSSTransition>
        // <div className={props.classNames + " " + (show && (props.doFade ?? true) ? `${props.in ? props.classNames + "-enter" : props.classNames + "-exit"}` : (props.doFade ?? true ? "" : props.classNames + "-enter"))}>
        // </div>
    );
}