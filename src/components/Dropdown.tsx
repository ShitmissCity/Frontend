import React, { useEffect, useState, Key, CSSProperties, useRef } from "react";

export default function Dropdown<T extends Key>(props: { elements: { key: T, value: string }[], title: string, onChange: (key: T) => void, className?: string, style?: CSSProperties }) {
    const [open, setOpen] = useState(false);
    const hiddenDropdownRef = useRef<HTMLUListElement>();
    const buttonRef = useRef<HTMLButtonElement>();

    function toggle() {
        setOpen(!open);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (event.target instanceof HTMLElement) {
                if (event.target.closest(".dropdown") === null) {
                    setOpen(false);
                }
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    function getTransform() {
        let dropdown = hiddenDropdownRef.current.getBoundingClientRect();
        let button = buttonRef.current.getBoundingClientRect();
        let x = 0;
        if (dropdown && button && (button.left + dropdown.width) > window.innerWidth) {
            x = 0 - (dropdown.width - button.width);
        }
        return `translate3d(${x}px, ${button.height}px, 0px)`;
    }

    return (
        <div className={props.className} style={props.style}>
            <div className="dropdown" style={{ display: "inline-block" }}>
                <button ref={buttonRef} className="btn btn-primary dropdown-toggle" type="button" aria-haspopup="true" aria-expanded="false" onClick={toggle}>{props.title}</button>
                <ul className={"dropdown-menu" + (open ? " show" : "")} style={open ? { position: "absolute", inset: "0px auto auto 0px", margin: 0, transform: getTransform() } : undefined}>
                    {props.elements.map(e => <li key={e.key}><a className="dropdown-item" onClick={() => { toggle(); props.onChange(e.key); }}>{e.value}</a></li>)}
                </ul>
            </div>
            <div className="dropdown" style={{ height: 0, position: "fixed", padding: 0, left: window.innerWidth, overflow: "hidden" }}>
                <ul ref={hiddenDropdownRef} className={"dropdown-menu show"} style={{ height: 0, position: "absolute" }}>
                    {props.elements.map(e => <li key={e.key}><a className="dropdown-item" onClick={() => { toggle(); props.onChange(e.key); }}>{e.value}</a></li>)}
                </ul>
            </div>
        </div>
    );
}