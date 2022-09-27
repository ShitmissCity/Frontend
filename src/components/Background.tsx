import React, { PropsWithChildren } from "react"

export default function BackgroundContainer(props: PropsWithChildren<{ size?: "small" | "medium" | "large" | "halfheight" | "fullheight" }>) {
    return (
        <div className={`hero is-${props.size ?? "medium"}`}>
            <div className="vidtop-content">
                {props.children}
            </div>
        </div>
    );
}