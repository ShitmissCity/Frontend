import React, { useEffect } from "react";
import { useTitle } from "../components/Title";
import { MapPool } from "../entity";
import Loader from "../components/Loader";
import Transition from "../components/Transition";
import BackgroundContainer from "../components/Background";
import "./MapPool.scss";
import { BeatSaverApi } from "../entity/BeatSaverApi";
import { getUrl } from "../components/Request";
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

    useEffect(() => {
        setTitle("Map Pools");
        fetch("img/scoresaber.svg").then(res => res.text()).then(setSvg);
        getUrl("/public/map-pool").then(res => res.json() as Promise<MapPool[]>).then(res => {
            let threads = [];
            for (const mapPoolKey in res) {
                if (Object.prototype.hasOwnProperty.call(res, mapPoolKey)) {
                    let maps = res[mapPoolKey].maps;
                    for (const mapKey in maps) {
                        if (Object.prototype.hasOwnProperty.call(res, mapKey)) {
                            threads.push(fetch(`https://api.beatsaver.com/maps/id/${maps[mapKey].song_id}`).then(res => res.json() as Promise<BeatSaverApi>).then(beatsaverRes => {
                                res[mapPoolKey].maps[mapKey].beatsaver = beatsaverRes;
                            }));
                        }
                    }
                }
            }
            Promise.all(threads).then(() => {
                setPools(res);
                setCurrentShown(poolIndex);
            });
        }).finally(() => setLoading(false));
    }, [setTitle]);

    return (
        <div>
            {loading ? <Loader /> : null}
            <BackgroundContainer size="small">
                <div className="hero-body">
                    <div className="container" style={{ width: "71%" }}>
                        <h1 className="title">
                            Map Pools
                        </h1>
                        <h2 className="subtitle">
                            The map pools for the tournament.
                        </h2>
                    </div>
                </div>
                <div className="hero-foot">
                    <nav className="tabs is-boxed is-fullwidth">
                        <div className="container">
                            <ul className="home-tabs">
                                {pools.map((pool, index) => (
                                    <li key={index} className={index === poolIndex ? "is-active" : ""} onClick={() => {
                                        setPoolIndex(index);
                                        setTimeout(() => {
                                            setCurrentShown(index);
                                        }, 500);
                                    }}>
                                        <a>{pool.name}</a> {/* eslint-disable-line */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                </div>
            </BackgroundContainer>
            <section className="section is-dark app-background">
                <Transition in={currentShown === poolIndex} classNames="slide-transition" timeout={500} doFade={!loading} >
                    {!loading && pools.length > 0 ? (
                        <div style={{ minHeight: 100 }} className="cards is-centered columns is-multiline">
                            {pools[poolIndex].maps.map((map, index) => (
                                <div className="card column is-3" key={index}>
                                    <Transition in={true} classNames="fade-transition" timeout={500}>
                                        <div className="bg-image" style={{ background: `linear-gradient(to left, rgba(36, 36, 36, 0.93), rgb(33, 33, 33)) repeat scroll 0% 0%, rgba(0, 0, 0, 0) url(${map.beatsaver.versions[map.beatsaver.versions.length - 1].coverURL})`, zIndex: -1 }}></div>
                                    </Transition>
                                    <div className="card-content bg-text">
                                        <div className="media">
                                            <div className="media-left">
                                                <figure className="image" style={{ width: 120 }}>
                                                    <Transition in={true} classNames="fade-transition" timeout={500}>
                                                        <img src={map.beatsaver.versions[map.beatsaver.versions.length - 1].coverURL} alt="Map Thumbnail" style={{ background: `border-radius: 0px; box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02)` }}></img>
                                                    </Transition>
                                                </figure>
                                            </div>
                                            <div className="media-content" style={{ position: "relative", flexDirection: "column", display: "flex" }}>
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
                                                    <span className="tag" style={{ backgroundColor: getMapTypeColor(map.type), color: "white", fontFamily: "Segoe UI" }}>{getMapTypeString(map.type)}</span>
                                                    <a data-tooltip="One Click" href={`beatsaver://${map.song_id}`} target="_blank" rel="noreferrer" style={{ marginLeft: 14, color: "white" }}><FontAwesomeIcon icon={solid("download")} /></a>
                                                    <a data-tooltip="BeatSaver" href={`https://beatsaver.com/maps/${map.song_id}`} target="_blank" rel="noreferrer" style={{ marginLeft: 14, color: "white" }}><FontAwesomeIcon icon={solid("compact-disc")} /></a>
                                                    <a data-tooltip="+1 Rabbit Viewer" href={`https://skystudioapps.com/bs-viewer/?id=${map.song_id}`} target="_blank" rel="noreferrer" style={{ marginLeft: 14, color: "white" }}><FontAwesomeIcon icon={solid("eye")} /></a>
                                                    <a href={`https://scoresaber.com/leaderboard/${map.scoresaber_id}`} style={{ marginLeft: 14, display: "inline-block" }}><div style={{ width: 24 }} dangerouslySetInnerHTML={{ __html: svg }}></div></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>))}
                        </div>
                    ) : null}
                </Transition>
            </section>
        </div>
    );
}