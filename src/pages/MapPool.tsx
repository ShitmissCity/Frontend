import React, { useEffect } from "react";
import { useTitle } from "../components/Title";
import { MapPool, Map } from "../entity";
import Loader from "../components/Loader";
import Transition from "../components/Transition";
import BackgroundContainer from "../components/Background";
import "./MapPool.scss";
import { BeatSaverApi } from "../entity/BeatSaverApi";
import { useRequest } from "../components/Request";
import SongInfo from "../components/SongInfo";

export default function MapPoolRender() {
    const [pools, setPools] = React.useState<MapPool[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [poolIndex, setPoolIndex] = React.useState(0);
    const [currentShown, setCurrentShown] = React.useState(-1);
    const { setTitle } = useTitle();
    const getUrl = useRequest().getUrl;

    async function getMapFromBeatsaver(maps: Map[], mapKey: string) {
        return await (await fetch(`https://api.beatsaver.com/maps/id/${maps[mapKey as any].song_id}`)).json() as Promise<BeatSaverApi>;
    }

    useEffect(() => {
        setTitle("Map Pools");
        getUrl("/public/mappool").then(res => res.json() as Promise<MapPool[]>).then(res => {
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
                                        <SongInfo map={map} index={index} fullStyle={true} />
                                    </Transition>
                                </div>))}
                        </div>
                    ) : null}
                </Transition>
            </section>
        </div >
    );
}