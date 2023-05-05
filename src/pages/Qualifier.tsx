import React, { useState, useEffect } from "react";
import { TransitionGroup } from "react-transition-group";
import BackgroundContainer from "../components/Background";
import Loader from "../components/Loader";
import { useRequest } from "../components/Request";
import SongInfo from "../components/SongInfo";
import { useTitle } from "../components/Title";
import Transition from "../components/Transition";
import { MapPool, Map } from "../entity";
import { BeatSaverApi } from "../entity/BeatSaverApi";
import { getScorePercentage, getScorePercentageRelative, getTeamScores } from "../entity/MapPoolAndScores";
import "./Qualifier.scss";

type res = (value: Response) => void;

export default function Teams() {
    const [loading, setLoading] = useState(true);
    const [qualif, setQualif] = useState<MapPool>(null);
    const { setTitle } = useTitle();
    const getUrl = useRequest().getUrl;

    async function getMapFromBeatsaver(maps: Map[], mapKey: string) {
        return await (await fetch(`https://api.beatsaver.com/maps/id/${maps[mapKey as any].song_id}`)).json() as Promise<BeatSaverApi>;
    }

    useEffect(() => {
        setTitle("Qualifier");
        getUrl("/public/qualifier").then(res => {
            return new Promise((resolve: res, reject: res) => {
                if (res.ok) {
                    resolve(res);
                } else {
                    reject(res);
                }
            });
        }).then(res => res.json() as Promise<MapPool>).then((res) => {
            let threads: { id: string, thread: Promise<BeatSaverApi> }[] = [];
            let maps = res.maps;
            for (const mapKey in maps) {
                if (Object.prototype.hasOwnProperty.call(maps, mapKey)) {
                    if (!threads.map(t => t.id).includes(maps[mapKey as any].song_id))
                        threads.push({ thread: getMapFromBeatsaver(maps, mapKey), id: maps[mapKey as any].song_id });
                }
            }
            Promise.all(threads).then(async () => {
                let maps = res.maps;
                let toBeDeleted: string[] = [];
                for (const mapKey in maps) {
                    if (Object.prototype.hasOwnProperty.call(maps, mapKey)) {
                        let thread = threads.find(t => t.id === maps[mapKey as any].song_id);
                        if (thread) {
                            let map = await thread.thread;
                            maps[mapKey as any].beatsaver = map;
                        }
                        else {
                            toBeDeleted.push(mapKey);
                        }
                    }
                }
                for (const key of toBeDeleted) {
                    delete maps[key as any];
                }
                setQualif(res);
            });
        }).catch(res => console.error(res.text())).finally(() => setLoading(false));
    }, [setTitle]);

    function drawTeamScores(map: Map) {
        var teams = getTeamScores(map)
        return teams.map((score, index) => {
            var backgroundColor = index % 2 === 0 ? (index / 15 > 1 ? "#ff000066" : "#00000033") : index / 15 > 1 ? "#ff000033" : "unset";
            return (
                <>
                    <div className="row g-0" style={{ borderTop: `solid ${index === 16 ? "5px #330000ff" : "1px #40404066"}`, backgroundColor: backgroundColor }}>
                        <p className="text-center pt-2 pb-2 col-1 m-0" style={{ color: "#999999" }}>#{index + 1}</p>
                        <p className="text-center pt-2 pb-2 col-3 m-0" style={{ borderLeft: "1px solid #40404066" }}>{score.player.username}</p>
                        <p className="text-center pt-2 pb-2 col-3 m-0" style={{ borderLeft: "1px solid #40404066" }}>{score.score}</p>
                        <p className="text-center pt-2 pb-2 col-5 m-0" style={{ borderLeft: "1px solid #40404066" }}>{getScorePercentage(score, map)}% <sub>({getScorePercentageRelative(score, teams)}%)</sub></p>
                    </div>
                </>
            );
        })
    }

    function drawPlayerScores(map: Map) {
        return map.scores.map((score, index) => (
            <div className="row g-0" style={{ borderTop: "1px solid #40404066", backgroundColor: index % 2 === 0 ? "#00000033" : "unset" }}>
                <p className="text-center pt-2 pb-2 col-1 m-0" style={{ color: "#999999" }}>#{index + 1}</p>
                <p className="text-center pt-2 pb-2 col-3 m-0" style={{ borderLeft: "1px solid #40404066" }}>{score.player.username}</p>
                <p className="text-center pt-2 pb-2 col-3 m-0" style={{ borderLeft: "1px solid #40404066" }}>{score.score}</p>
                <p className="text-center pt-2 pb-2 col-5 m-0" style={{ borderLeft: "1px solid #40404066" }}>{getScorePercentage(score, map)}% <sub>({getScorePercentageRelative(score, map.scores)}%)</sub></p>
            </div>
        ));
    }

    return (
        <>
            <Loader hide={!loading} />
            <BackgroundContainer size="small">
                <div className="hero-body">
                    <div className="container" style={{ width: "71%" }}>
                        <h1 className="title">
                            Qualifier
                        </h1>
                    </div>
                </div>
            </BackgroundContainer>
            <section className="section app-background">
                <TransitionGroup>
                    {!loading && qualif && qualif.maps.map((map, index) => (
                        <Transition in={true} classNames="mb-3 fade-transition" timeout={500}>
                            <SongInfo map={map} index={index} fullStyle={false} additionalContent={
                                (
                                    <>
                                        <div className="col-3 mt-3 me-3 mb-3 fancy-scrollbar rounded" style={{ height: "calc(256px - 2rem)", overflow: "hidden", overflowY: "scroll", position: "relative", paddingTop: 56 }}>
                                            <div className="card">
                                                <div className="row g-0" style={{ position: "fixed", width: "25%", top: "1rem", paddingRight: 15, borderStartEndRadius: "var(--bs-border-radius)", borderStartStartRadius: "var(--bs-border-radius)", overflow: "hidden" }}>
                                                    <div className="d-flex" style={{ backgroundColor: "#111111aa" }}>
                                                        <h3 className="text-center pt-2 pb-2 col-1 m-0">&nbsp;</h3>
                                                        <h3 className="text-center pt-2 pb-2 col-3 m-0" style={{ borderLeft: "1px solid #40404066" }}>Team</h3>
                                                        <h3 className="text-center pt-2 pb-2 col-3 m-0" style={{ borderLeft: "1px solid #40404066" }}>Score</h3>
                                                        <h3 className="text-center pt-2 pb-2 col-5 m-0" style={{ borderLeft: "1px solid #40404066" }}>Accuracy <sub>(Relative)</sub></h3>
                                                    </div>
                                                </div>
                                                {drawTeamScores(map)}
                                            </div>
                                        </div>
                                        <div className="col-3 mt-3 me-3 mb-3 fancy-scrollbar rounded" style={{ height: "calc(256px - 2rem)", overflow: "hidden", overflowY: "scroll", position: "relative", paddingTop: 56 }}>
                                            <div className="card">
                                                <div className="row g-0" style={{ position: "fixed", width: "25%", top: "1rem", paddingRight: 15, borderStartEndRadius: "var(--bs-border-radius)", borderStartStartRadius: "var(--bs-border-radius)", overflow: "hidden" }}>
                                                    <div className="d-flex" style={{ backgroundColor: "#111111aa" }}>
                                                        <h3 className="text-center pt-2 pb-2 col-1 m-0">&nbsp;</h3>
                                                        <h3 className="text-center pt-2 pb-2 col-3 m-0" style={{ borderLeft: "1px solid #40404066" }}>Player</h3>
                                                        <h3 className="text-center pt-2 pb-2 col-3 m-0" style={{ borderLeft: "1px solid #40404066" }}>Score</h3>
                                                        <h3 className="text-center pt-2 pb-2 col-5 m-0" style={{ borderLeft: "1px solid #40404066" }}>Accuracy <sub>(Relative)</sub></h3>
                                                    </div>
                                                </div>
                                                {drawPlayerScores(map)}
                                            </div>
                                        </div>
                                    </>
                                )
                            } />
                        </Transition>))}
                </TransitionGroup>
                {!loading && !qualif && (
                    <div className="d-flex justify-content-center">
                        <h3 className="text-center">No qualifier available at this moment.</h3>
                    </div>
                )}
            </section>
        </>
    );
}