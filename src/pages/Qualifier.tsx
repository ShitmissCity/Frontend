import React, { useState, useEffect } from "react";
import BackgroundContainer from "../components/Background";
import Loader from "../components/Loader";
import { useRequest } from "../components/Request";
import SongInfo from "../components/SongInfo";
import TeamCard from "../components/TeamCard";
import { useTitle } from "../components/Title";
import Transition from "../components/Transition";
import { MapPool, Map } from "../entity";
import { BeatSaverApi } from "../entity/BeatSaverApi";
import { getCharaStringFromMapType, getMapTypeFromCharaString, getScorePercentage, getScorePercentageRelative, getTeamScores } from "../entity/MapPoolAndScores";
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
        return teams.map((score, index) => (
            <tr>
                <td><p className="text-center ps-2 pe-2" style={{ color: "#999999" }}>#{index + 1}</p></td>
                <td><p className="text-center ps-2 pe-2">{score.player.username}</p></td>
                <td><p className="text-center ps-2 pe-2">{score.score}</p></td>
                <td><p className="text-center ps-2 pe-2">{getScorePercentage(score, map)}% <sub>({getScorePercentageRelative(score, teams)}%)</sub></p></td>
            </tr>
        ))
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
                {!loading && qualif && qualif.maps.map((map, index) => (
                    <div className="col mb-2">
                        <Transition in={true} classNames="fade-transition" timeout={500}>
                            <SongInfo map={map} index={index} fullStyle={false} additionalContent={
                                (
                                    <>
                                        <div className="col-3 pt-3">
                                            <div className="container d-flex justify-content-center">
                                                <table>
                                                    <tr>
                                                        <th><h3 className="text-center ps-2 pe-2">&nbsp;&nbsp;</h3></th>
                                                        <th><h3 className="text-center ps-2 pe-2">Team</h3></th>
                                                        <th><h3 className="text-center ps-2 pe-2">Score</h3></th>
                                                        <th><h3 className="text-center ps-2 pe-2">Accuracy <sub>(Relative)</sub></h3></th>
                                                    </tr>
                                                    {drawTeamScores(map)}
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-3 pt-3">
                                            <div className="container d-flex justify-content-center">
                                                <table>
                                                    <tr>
                                                        <th><h3 className="text-center ps-2 pe-2">&nbsp;&nbsp;</h3></th>
                                                        <th><h3 className="text-center ps-2 pe-2">Player</h3></th>
                                                        <th><h3 className="text-center ps-2 pe-2">Score</h3></th>
                                                        <th><h3 className="text-center ps-2 pe-2">Accuracy <sub>(Relative)</sub></h3></th>
                                                    </tr>
                                                    {map.scores.map((score, index) => (
                                                        <tr>
                                                            <td><p className="text-center ps-2 pe-2" style={{ color: "#999999" }}>#{index + 1}</p></td>
                                                            <td><p className="text-center ps-2 pe-2">{score.player.username}</p></td>
                                                            <td><p className="text-center ps-2 pe-2">{score.score}</p></td>
                                                            <td><p className="text-center ps-2 pe-2">{getScorePercentage(score, map)}% <sub>({getScorePercentageRelative(score, map.scores)}%)</sub></p></td>
                                                        </tr>
                                                    ))}
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                )
                            } />
                        </Transition>
                    </div>))}
                {!loading && !qualif && (
                    <div className="d-flex justify-content-center">
                        <h3 className="text-center">No qualifier available at this moment.</h3>
                    </div>
                )}
            </section>
        </>
    );
}