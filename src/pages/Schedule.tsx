import React from "react";

export default function Schedule() {
    return (
        <div>
            <h1 className="apply-font theme-color">Schedule</h1>
            <h2 className="theme-color">
                The tournament is tied to the schedule below.
            </h2>
            <div className="theme-color ps-3">
                <h6>The tournament will take place on two days, Sometime {process.env.REACT_APP_YEAR}.</h6>
                <h6>We will start at some time on both days.</h6>
            </div>
            <h5 className="theme-color"><b>Deadlines</b></h5>
            <div className="theme-color ps-3">
                <h6>Signups will be open from the time the website is announced until unknown date.</h6>
                <h6>Qualifiers will be from Announcement until some time and day.</h6>
            </div>
        </div>
    );
}