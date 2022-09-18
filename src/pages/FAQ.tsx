import React from "react";
import Collapse from "../components/Collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

export default function FAQ() {
    const collapses = [
        {
            title: 'How many players are there per team?',
            text: 'There are 4 players per team, but only 2 are playing at a time. Player-switching is allowed (See last years VODs up on <a href="https://twitch.tv/shitmisscity">our Twitch Channel</a>).'
        },
        {
            title: 'Can I play on Quest?',
            text: 'Only if you have a PC and Link/Virtual Desktop. (We recommend Link for the least amount of latency)'
        },
        {
            title: 'I am banned on ScoreSaber/Dont use ScoreSaber, am i allowed to participate?',
            text: 'No, you need to have a ScoreSaber account to be able to sign up.'
        },
        {
            title: 'What mods are banned/allowed?',
            text: 'See the <a href="https://beatkhana.com/rules">BeatKhana rules</a> for more info regarding this.'
        },
        {
            title: 'Can I volunteer and play?',
            text: 'Yes, you can, but we will have asked people in advance if they are available to help out. Note that Map Poolers are not allowed to play.'
        },
        {
            title: 'Will Tournament Organizers or Staff members be playing?',
            text: 'No, Organizers and Staff will not be playing.'
        },
        {
            title: 'Are everyone guaranteed a spot in the tournament?',
            text: 'No, the top 32 teams (max of 128 players) are allowed into the tournament at the end of the qualifiers.'
        }
    ]

    const [openStates, setOpenStates] = React.useState(collapses.map(() => false));

    return (
        <div>
            <h1 className="title apply-font theme-color">Frequently Asked Questions</h1>
            <h2 className="subtitle theme-color">
                If you have any other questions that are not listed below, <a href="https://discord.gg/h58zp9f">join our Discord</a>.
            </h2>

            {collapses.map((item, index) => (
                <Collapse key={index} className="card" animation="slide" open={openStates[index]}>
                    <div className="card-header" onClick={() => {
                        var newStates = [...openStates];
                        newStates[index] = !newStates[index];
                        setOpenStates(newStates);
                    }}>
                        <p className="card-header-title">{item.title}</p>
                        <span className="card-header-icon" aria-label="more options">
                            <span className="icon">
                                <FontAwesomeIcon icon={openStates[index] ? solid("angle-down") : solid("angle-up")} />
                            </span>
                        </span>
                    </div>
                    <div className="card-content">
                        <div className="content" dangerouslySetInnerHTML={{ __html: item.text }}></div>
                    </div>
                </Collapse>
            ))}
        </div>
    );
}