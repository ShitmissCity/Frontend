import React from "react";

export default function Schedule() {
    return (
        <div>
            <h1 className="title apply-font theme-color">Schedule</h1>
            <h2 className="subtitle theme-color">
                The tournament is tied to the schedule below.
            </h2>
            <ul className="theme-color">
                <li>The tournament will take place on two days, May 8th and May 9th 2021.</li>
                <li>We will start at 17:00 UTC on both days.</li>
                <br />
                <li><b>Deadlines</b></li>
                <li>Signups will be open from the time the website is announced until May 1st 23:59 UTC.</li>
                <li>Qualifiers will be from Announcement until May 3rd 18:00 UTC.</li>
            </ul>
        </div>
    );
}