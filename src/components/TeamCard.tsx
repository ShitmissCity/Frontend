import React from "react";
import { Team } from "../entity";

export default function TeamCard(props: { team: Team }) {
    var team = props.team;

    return (
        <div className="col mb-2">
            <div className="card rounded" style={{ marginRight: 14, marginBottom: 14 }}>
                <div className="row g-0">
                    <div className="col-sm-3">
                        <img src={team.avatar_url} alt="Team image" style={{ borderRight: `3px solid ${team.color}` }} className="rounded-start img-fluid" />
                    </div>
                    <div className="col-sm-9">
                        <h5>{team.name}</h5>
                        <h6>Users</h6>
                        <h6>{team.members.map(t => t.username).join(", ")}</h6>
                    </div>
                </div>
            </div>
        </div>);
}