import React, { useEffect, lazy, useState } from "react";
import { useTitle } from "../components/Title";
import "./Home.scss";

export default function Home() {
    const { setTitle } = useTitle();
    const [tab, setTab] = useState(0);
    const pages = [
        { name: "FAQ", component: lazy(() => import("./FAQ")) },
        { name: "Schedule", component: lazy(() => import("./Schedule")) },
    ]

    useEffect(() => {
        setTitle("Home");
    }, [setTitle]);

    return (
        <div>
            <div className="hero is-medium">
                <div className="vidtop-content">
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <h2 className="subtitle" style={{ fontSize: 64, lineHeight: "50px", paddingTop: "3vh" }}>
                                <img src="/img/logo.png" alt="BSN" style={{ width: "60%", marginRight: 10, borderRadius: 5 }} />
                            </h2>
                            {/* <b-notification v-if="$store.getters.isAuthenticated && !$store.getters.user.player" className="animated">
              You must sign up in order to play, click <router-link :to="{ name: 'Player Signup' }">here</router-link> to do so.
            </b-notification> */}
                        </div>
                    </div>

                    {/* <!-- Hero footer: will stick at the bottom --> */}
                    <div className="hero-foot">
                        <nav className="tabs is-boxed is-fullwidth">
                            <div className="container">
                                <ul className="home-tabs">
                                    {pages.map((page, index) => (
                                        <li key={index} className={index === tab ? "is-active" : ""} onClick={() => { setTab(index); }}>
                                            <a>{page.name}</a>
                                        </li>
                                    ))}
                                    {/* <li v-for="(item, index) in pages" key="item.name" onClick="swapPage(index)" className="{'is-active': currentPage === index }"><a style={{ border: 0 }}>{{ item.name }}</a></li> */}
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div >
                <div className="video-background">
                    <div className="video-foreground">
                        <iframe frameBorder={0} height="100%" width="100%" src="https://youtube.com/embed/EJ9N0PGcc2Q?controls=0&showinfo=0&rel=0&autoplay=1&mute=1&loop=1&playlist=EJ9N0PGcc2Q" />
                    </div>
                </div>
            </div>
            <div className="is-dark" style={{ zIndex: 1 }}>
                <section className="section app-background">
                    <div className="container">
                        {/* <transition name="faq-transition" mode="out-in">
                            <component is="pages[currentPage].component"></component>
                        </transition> */}
                    </div>
                </section>
            </div>
        </div>
    );
}