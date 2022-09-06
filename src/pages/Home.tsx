import React, { useEffect } from "react";
import { useTitle } from "../components/Title";

export default function Home() {
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Home");
    }, [setTitle]);

    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}