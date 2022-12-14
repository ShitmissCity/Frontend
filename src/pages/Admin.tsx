import React from "react";
import BackgroundContainer from "../components/Background";

export default function Admin() {
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
            </BackgroundContainer>
        </>
    );
}