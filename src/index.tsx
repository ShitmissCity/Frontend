import React, { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.scss";
import { Footer, Header } from "./components/Partials";
import Title from "./components/Title";
import Loader from "./components/Loader";
import Request from "./components/Request";
import Cookie from "./components/Cookie";
import Modal from "./components/Modal";
import Auth from "./components/Auth";
const App = lazy(() => import("./App"));

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");

function Index() {
    return <React.StrictMode>
        <Suspense fallback={<Loader />}>
            <BrowserRouter basename={baseUrl}>
                <Title>
                    <Cookie>
                        <Request>
                            <Auth>
                                <Modal>
                                    <Header />
                                    <App />
                                    <Footer />

                                    <div className="video-background">
                                        <div className="video-foreground">
                                            <iframe frameBorder={0} height="100%" width="100%" src="https://youtube.com/embed/EJ9N0PGcc2Q?controls=0&showinfo=0&rel=0&autoplay=1&mute=1&loop=1&playlist=EJ9N0PGcc2Q" title="background video" />
                                        </div>
                                    </div>
                                </Modal>
                            </Auth>
                        </Request>
                    </Cookie>
                </Title>
            </BrowserRouter>
        </Suspense>
    </React.StrictMode>;
}

createRoot(document.getElementById("root")).render(<Index />);