import React, { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
const App = lazy(() => import("./App"));

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");

function Index() {
    return <React.StrictMode>
        <Suspense fallback={"Loading..."}>
            <BrowserRouter basename={baseUrl}>
                <App />
            </BrowserRouter>
        </Suspense>
    </React.StrictMode>;
}

import("react-dom").then(ReactDom => {
    ReactDom.render(<Index />, document.getElementById("root"));
})