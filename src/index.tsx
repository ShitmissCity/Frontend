import React, { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";
import { Footer, Header } from "./components/Partials";
import Title from "./components/Title";
import Loader from "./components/Loader";
const App = lazy(() => import("./App"));

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");

function Index() {
    return <React.StrictMode>
        <Suspense fallback={<Loader />}>
            <BrowserRouter basename={baseUrl}>
                <Title>
                    <Header />
                    <App />
                    <Footer />
                </Title>
            </BrowserRouter>
        </Suspense>
    </React.StrictMode>;
}

import("react-dom").then(ReactDom => {
    ReactDom.render(<Index />, document.getElementById("root"));
})