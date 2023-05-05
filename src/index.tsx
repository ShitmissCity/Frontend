import React, { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.scss";
import { Footer, Header } from "./components/Partials";
import Title from "./components/Title";
import Loader from "./components/Loader";
import Request from "./components/Request";
import Modal from "./components/Modal";
import Auth from "./components/Auth";
import Toast from "./components/Toast";
const App = lazy(() => import("./App"));
const ReactHlsPlayer = lazy(() => import("react-hls-player"));

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");

function Index() {
    const playerRef = React.useRef<HTMLVideoElement>();

    function play() {
        if (playerRef.current) {
            playerRef.current.play();
            document.getElementById("root").removeEventListener("click", play);
        }
    }

    React.useEffect(() => {
        document.getElementById("root").addEventListener("click", play);
    })

    return <React.StrictMode>
        <Suspense fallback={<Loader />}>
            <BrowserRouter basename={baseUrl}>
                <Title>
                    <Toast>
                        <Request>
                            <Auth>
                                <Modal>
                                    <Header />
                                    <App />
                                    <Footer />

                                    <div className="video-background">
                                        <div className="video-foreground">
                                            <ReactHlsPlayer
                                                playerRef={playerRef}
                                                src="img/background.m3u8"
                                                controls={false}
                                                width="100%"
                                                height="100%"
                                                loop={true}
                                                muted={true}
                                                playsInline={true}
                                                autoPlay={true}
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                    </div>
                                </Modal>
                            </Auth>
                        </Request>
                    </Toast>
                </Title>
            </BrowserRouter>
        </Suspense>
    </React.StrictMode>;
}

function UnsuportedBrowser() {
    return <div className="container">
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <h1 className="card-title">Unsuported Browser</h1>
                        <p className="card-text">Your browser does not support the features required by this website. Please use a modern chromium browser such as <a className="btn btn-primary" href="https://www.google.com/chrome/">Google Chrome</a> or <a className="btn btn-primary" href="https://www.microsoft.com/edge">Edge</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

if (window.navigator.userAgent.includes("AppleWebKit"))
    createRoot(document.getElementById("root")).render(<Index />);
else
    createRoot(document.getElementById("root")).render(<UnsuportedBrowser />);