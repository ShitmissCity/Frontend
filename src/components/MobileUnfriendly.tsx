import React from "react";
import BackgroundContainer from "./Background";

export default function MobileUnfriendly() {
    return (
        <BackgroundContainer size="small">
            <div className="hero-body">
                <div className="container">
                    <div className="row">
                        <div className="col text-center" style={{ background: "var(--app-background-color)", padding: 7, borderRadius: 14 }}>
                            <h3 className="title">Unavailable on Mobile</h3>
                            <h4 className="subtitle">This page is not designed to be viewed on mobile devices.</h4>
                        </div>
                    </div>
                </div>
            </div>
        </BackgroundContainer>
    );
}