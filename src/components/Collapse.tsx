import React, { cloneElement, PropsWithChildren, DetailedReactHTMLElement, Children, CSSProperties, HTMLAttributes } from "react";
import "./Collapse.scss";

export default function Collapse(props: PropsWithChildren<{ open: boolean, animation: string, className?: string, style?: CSSProperties }>) {

    const children = Children.toArray(props.children);

    const contentChild = children[1] as DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>;

    const Content = cloneElement(contentChild, { className: contentChild.props.className + " " + props.animation + " " + (props.open ? props.animation + "-open" : props.animation + "-close") });

    return (
        <div className={props.className} style={props.style}>
            {children[0]}
            {Content}
        </div>
    );
}