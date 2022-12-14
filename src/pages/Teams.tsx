import React, { useState, useEffect } from "react";
import BackgroundContainer from "../components/Background";
import Loader from "../components/Loader";
import { useRequest } from "../components/Request";
import TeamCard from "../components/TeamCard";
import { useTitle } from "../components/Title";
import Transition from "../components/Transition";
import { Team } from "../entity";

export default function Teams() {
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState<Team[]>([]);
    const { setTitle } = useTitle();
    const getUrl = useRequest().getUrl;

    useEffect(() => {
        setTitle("Teams");
        getUrl("/public/teams/all").then(res => res.json() as Promise<Team[]>).then(setTeams).finally(() => setLoading(false));
    }, [setTitle]);

    return (
        <>
            <Loader hide={!loading} />
            <BackgroundContainer size="small">
                <div className="hero-body">
                    <div className="container" style={{ width: "71%" }}>
                        <h1 className="title">
                            Teams
                        </h1>
                        <h2 className="subtitle">
                            {teams.length}
                        </h2>
                    </div>
                </div>
            </BackgroundContainer>
            <section className="section app-background">
                <Transition in={!loading} timeout={500} classNames="slide-transition">
                    {!loading && teams.length > 0 ? <div style={{ minHeight: 100 }} className="row row-cols-1 row-cols-lg-2 row-cols-xxl-4 justify-content-center">
                        {teams.map((team, index) => (
                            <TeamCard team={team} key={index} />
                        ))}
                    </div> : <div></div>}
                </Transition>
            </section>
        </>
    );
}