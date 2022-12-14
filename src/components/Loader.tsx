import React from "react";
import "./Loader.scss";

export default function Loader(props: { hide?: boolean }) {
    return (
        <div className={"loader-wrapper" + (props.hide ? " hidden" : "")}>
            <div className="loader" />
        </div>
    );
}