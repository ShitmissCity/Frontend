import React, { useEffect, useState } from "react";
import BackgroundContainer from "../components/Background";
import Loader from "../components/Loader";
import { useRequest } from "../components/Request";
import TeamCard from "../components/TeamCard";
import { useTitle } from "../components/Title";
import Transition from "../components/Transition";
import { User, Team } from "../entity";

export default function Staff() {
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState<User[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const { setTitle } = useTitle();
    const getUrl = useRequest().getUrl;

    useEffect(() => {
        setTitle("Staff");
        getUrl("/public/users/getstaff")
            .then(res => res.json() as Promise<User[]>)
            .then(setStaff)
            .finally(() =>
                getUrl("/public/teams/staffteams")
                    .then(res => res.json() as Promise<Team[]>)
                    .then(setTeams)
                    .finally(() => setLoading(false)));

    }, [setTitle]);

    return (<div>
        {loading ? <Loader /> : null}
        <BackgroundContainer size="small">
            <div className="hero-body">
                <div className="container" style={{ width: "71%" }}>
                    <h1 className="title">
                        Staff
                    </h1>
                    <h2 className="subtitle">
                        The staff team behind Shitmiss City {process.env.REACT_APP_YEAR}.
                    </h2>
                </div>
            </div>
        </BackgroundContainer>
        <section className="section app-background">
            <div className="d-flex justify-content-evenly mb-5">
                <h3 className="theme-color text-center">Teams<br /><h4>{teams.length}</h4></h3>
                <h3 className="theme-color text-center">Staff Memebers<br /><h4>{staff.length}</h4></h3>
            </div>
            <h2 className="subtitle text-center">Staff</h2>
            <Transition in={!loading} timeout={500} classNames="slide-transition">
                {!loading && staff.length > 0 ? <div style={{ minHeight: 100 }} className="row row-cols-1 row-cols-lg-2 row-cols-xxl-4 justify-content-center">
                    {staff.map((user, index) => (
                        <div className="col mb-2">
                            <div key={index} className="card rounded" style={{ marginRight: 14, marginBottom: 14 }}>
                                <div className="row g-0">
                                    <div className="col-sm-3">
                                        <img src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar_id}.webp`} alt="User image" className="img-fluid rounded-start" />
                                    </div>
                                    <div className="col-sm-9">
                                        <h5>{user.username}</h5>
                                        <p>{user.role.position}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> : <div></div>}
            </Transition>
            <br />
            <h2 className="subtitle text-center">Teams</h2>
            <Transition in={!loading} timeout={500} classNames="slide-transition">
                {!loading && teams.length > 0 ? <div style={{ minHeight: 100 }} className="row row-cols-1 row-cols-lg-2 row-cols-xxl-4 justify-content-center">
                    {teams.map((team, index) => (
                        <TeamCard team={team} key={index} />
                    ))}
                </div> : <div></div>}
            </Transition>
        </section>
    </div>);
}