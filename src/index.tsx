import React, { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import Title from "./components/Title";
const App = lazy(() => import("./App"));

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");

function Index() {
    return <React.StrictMode>
        <Suspense fallback={"Loading..."}>
            <BrowserRouter basename={baseUrl}>
                <Title>
                    <App />
                </Title>
            </BrowserRouter>
        </Suspense>
    </React.StrictMode>;
}

import("react-dom").then(ReactDom => {
    ReactDom.render(<Index />, document.getElementById("root"));
})