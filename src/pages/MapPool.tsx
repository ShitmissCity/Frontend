import React, { useEffect } from "react";
import { useTitle } from "../components/Title";
import { MapPool, Map } from "../entity";
import Loader from "../components/Loader";
import Transition from "../components/Transition";
import BackgroundContainer from "../components/Background";
import "./MapPool.scss";
import { BeatSaverApi } from "../entity/BeatSaverApi";
import { useRequest } from "../components/Request";
import { getMapTypeColor, getMapTypeString } from "../entity/MapPoolAndScores";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

export default function MapPoolRender() {
    const [pools, setPools] = React.useState<MapPool[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [poolIndex, setPoolIndex] = React.useState(0);
    const [currentShown, setCurrentShown] = React.useState(-1);
    const [svg, setSvg] = React.useState(null);
    const { setTitle } = useTitle();
    const getUrl = useRequest().getUrl;

    async function getMapFromBeatsaver(maps: Map[], mapKey: string) {
        return await (await fetch(`https://api.beatsaver.com/maps/id/${maps[mapKey as any].song_id}`)).json() as Promise<BeatSaverApi>;
    }

    useEffect(() => {
        setTitle("Map Pools");
        fetch("img/scoresaber.svg").then(res => res.text()).then(setSvg);
        getUrl("/public/map-pool").then(res => res.json() as Promise<MapPool[]>).then(res => {
            let threads: { id: string, thread: Promise<BeatSaverApi> }[] = [];
            for (const mapPoolKey in res) {
                if (Object.prototype.hasOwnProperty.call(res, mapPoolKey)) {
                    let maps = res[mapPoolKey].maps;
                    for (const mapKey in maps) {
                        if (Object.prototype.hasOwnProperty.call(maps, mapKey)) {
                            if (!threads.map(t => t.id).includes(maps[mapKey as any].song_id))
                                threads.push({ thread: getMapFromBeatsaver(maps, mapKey), id: maps[mapKey as any].song_id });
                        }
                    }
                }
            }
            Promise.all(threads).then(async () => {
                for (const mapPoolKey in res) {
                    if (Object.prototype.hasOwnProperty.call(res, mapPoolKey)) {
                        let maps = res[mapPoolKey].maps;
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
                    }
                }
                setPools(res);
                setCurrentShown(poolIndex);
            });
        }).finally(() => setLoading(false));
    }, [setTitle]);

    return (
        <div>
            <Loader hide={!loading} />
            <BackgroundContainer size="small">
                <div className="hero-body">
                    <div className="container" style={{ width: "71%" }}>
                        <h1 className="title">
                            Map Pools
                        </h1>
                        <h4 className="subtitle">
                            The map pools for the tournament.
                        </h4>
                    </div>
                </div>
                <div className="hero-foot">
                    <div className="container">
                        <ul className="nav justify-content-center nav-pills nav-fill app-background rounded-top">
                            {pools.length === 0 && (
                                <li className="nav-item">
                                    <a className="nav-link">&nbsp;</a> {/* eslint-disable-line */}
                                </li>
                            )}
                            {pools.map((pool, index) => (
                                <li key={index} className="nav-item" onClick={() => {
                                    setPoolIndex(index);
                                    setTimeout(() => {
                                        setCurrentShown(index);
                                    }, 500);
                                }}>
                                    <a className={"nav-link" + (index === poolIndex ? " active" : "")}>{pool.name}</a> {/* eslint-disable-line */}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </BackgroundContainer>
            <section className="section is-dark app-background" style={{ minHeight: "56.3vh" }}>
                <Transition in={currentShown === poolIndex} classNames="slide-transition" timeout={500} doFade={!loading} >
                    {!loading && pools.length > 0 ? (
                        <div style={{ minHeight: 100 }} className="row row-cols-1 row-cols-lg-2 row-cols-xxl-4 justify-content-center">
                            {pools[poolIndex].maps.map((map, index) => (
                                <div className="col mb-2">
                                    <Transition in={true} classNames="fade-transition" timeout={500}>
                                        <div className="card rounded" key={index} style={{ background: `linear-gradient(to left, rgba(36, 36, 36, 0.93), rgb(33, 33, 33)) repeat scroll 0% 0%, rgba(0, 0, 0, 0) url(${map.beatsaver.versions[map.beatsaver.versions.length - 1].coverURL})`, backgroundSize: "cover" }}>
                                            <div className="row g-0">
                                                <div className="col-sm-3">
                                                    <img src={map.beatsaver.versions[map.beatsaver.versions.length - 1].coverURL} alt="Map Thumbnail" className="img-fluid rounded-start" style={{ background: `border-radius: 0px; box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02)` }} />
                                                </div>
                                                <div className="ps-2 col-sm-9">
                                                    <div className="card-body d-flex flex-column">
                                                        <p className="title" style={{ fontSize: "2.5vh", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 0 }}>
                                                            <a href={`https://beatsaver.com/maps/${map.song_id}`}>
                                                                {map.beatsaver.metadata.songName}
                                                            </a>
                                                        </p>
                                                        <span style={{ width: "100%", color: "#8c8c8c", wordWrap: "normal", whiteSpace: "break-spaces" }}>
                                                            Song by: {map.beatsaver.metadata.songAuthorName}
                                                        </span>
                                                        <span style={{ width: "100%", color: "#8c8c8c", wordWrap: "normal", whiteSpace: "break-spaces" }}>
                                                            Mapped by: {map.beatsaver.metadata.levelAuthorName}
                                                        </span>
                                                        <div style={{ marginTop: "auto", display: "flex" }}>
                                                            <span className="badge" style={{ backgroundColor: getMapTypeColor(map.type), color: "white", fontFamily: "Segoe UI", lineHeight: "unset" }}>{getMapTypeString(map.type)}</span>
                                                            <a data-tooltip="One Click" href={`beatsaver://${map.song_id}`} target="_blank" rel="noreferrer" style={{ marginLeft: 14, color: "white" }}><FontAwesomeIcon icon={solid("download")} /></a>
                                                            <a data-tooltip="BeatSaver" href={`https://beatsaver.com/maps/${map.song_id}`} target="_blank" rel="noreferrer" style={{ marginLeft: 14, color: "white" }}><FontAwesomeIcon icon={solid("compact-disc")} /></a>
                                                            <a data-tooltip="+1 Rabbit Viewer" href={`https://skystudioapps.com/bs-viewer/?id=${map.song_id}`} target="_blank" rel="noreferrer" style={{ marginLeft: 14, color: "white" }}><FontAwesomeIcon icon={solid("eye")} /></a>
                                                            <a href={`https://scoresaber.com/leaderboard/${map.scoresaber_id}`} style={{ marginLeft: 14, display: "inline-block" }}><div style={{ width: 24 }} dangerouslySetInnerHTML={{ __html: svg }}></div></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>))}
                        </div>
                    ) : null}
                </Transition>
            </section>
        </div >
    );
}