import React, { useEffect, useState } from "react";
import BackgroundContainer from "../components/Background";
import Transition from "../components/Transition";
import Qualifier from "../components/admin/Qualifier";
import MapPool from "../components/admin/MapPool";
import { useTitle } from "../components/Title";

export default function Admin() {
    const { setTitle } = useTitle();
    const [tab, setTab] = useState(0);
    const [fade, setFade] = React.useState(true);
    const timeout = 500;
    const pages = [
        { name: "Qualifier", component: <Qualifier /> },
        { name: "Map Pools", component: <MapPool /> }
    ]

    useEffect(() => {
        setTitle("Admin Panel");
    }, [setTitle]);

    useEffect(() => {
        setFade(false);
        setTimeout(() => {
            setFade(true);
        }, timeout);
    }, [tab]);

    return (
        <>
            <BackgroundContainer size="small">
                <div className="hero-body">
                    <div className="container" style={{ width: "71%" }}>
                        <h1 className="title">
                            Admin Panel
                        </h1>
                    </div>
                </div>
                <div className="hero-foot">
                    <nav className="tabs is-boxed is-fullwidth">
                        <div className="container">
                            <ul className="nav justify-content-center nav-pills nav-fill app-background rounded-top">
                                {pages.map((page, index) => (
                                    <li key={index} className="nav-item rounded-top" onClick={() => { setTab(index); }}>
                                        <a className={"nav-link" + (index === tab ? " active" : "")}>{page.name}</a> {/* eslint-disable-line */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                </div>
            </BackgroundContainer>
            <section className="section app-background">
                <div className="container-fluid transition theme-color">
                    <Transition classNames="faq-transition"
                        timeout={timeout}
                        in={fade}>
                        {pages[tab].component}
                    </Transition>
                </div>
            </section>
        </>
    );
}