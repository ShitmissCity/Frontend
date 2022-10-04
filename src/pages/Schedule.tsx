import React from "react";

export default function Schedule() {
    return (
        <div>
            <h1 className="title apply-font theme-color">Schedule</h1>
            <h2 className="subtitle theme-color">
                The tournament is tied to the schedule below.
            </h2>
            <ul className="theme-color">
                <li>The tournament will take place on two days, Sometime {process.env.REACT_APP_YEAR}.</li>
                <li>We will start at some time on both days.</li>
                <br />
                <li><b>Deadlines</b></li>
                <li>Signups will be open from the time the website is announced until unknown date.</li>
                <li>Qualifiers will be from Announcement until some time and day.</li>
            </ul>
        </div>
    );
}