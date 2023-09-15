import React, { useEffect, useState } from "react";
import { useTitle } from "../components/Title";
import "./Home.scss";
import BackgroundContainer from "../components/Background";
import FAQ from "./FAQ";
import Schedule from "./Schedule";
import Transition from "../components/Transition";

export default function Home() {
    const { setTitle } = useTitle();
    const [tab, setTab] = useState(0);
    const [fade, setFade] = useState(true);
    const timeout = 500;
    const pages = [
        { name: "FAQ", component: <FAQ /> },
        { name: "Schedule", component: <Schedule /> },
    ]

    useEffect(() => {
        setTitle("Home");
    }, [setTitle]);

    useEffect(() => {
        setFade(false);
        setTimeout(() => {
            setFade(true);
        }, timeout);
    }, [tab]);

    return (
        <div>
            <BackgroundContainer>
                <div className="hero-body">
                    <div className="container d-flex justify-content-center">
                        <img src="/img/logo.png" alt="BSN" style={{ width: "60%", marginRight: 10, borderRadius: 5 }} />
                        {/* <b-notification v-if="$store.getters.isAuthenticated && !$store.getters.user.player" className="animated">
              You must sign up in order to play, click <router-link :to="{ name: 'Player Signup' }">here</router-link> to do so.
            </b-notification> */}
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
            <div className="is-dark" style={{ zIndex: 1 }}>
                <section className="section app-background">
                    <div className="container transition">
                        <Transition classNames="faq-transition"
                            timeout={timeout}
                            in={fade}>
                            {pages[tab].component}
                        </Transition>
                    </div>
                </section>
            </div>
        </div >
    );
}