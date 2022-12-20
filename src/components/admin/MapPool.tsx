import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { MapPool, Map } from "../../entity";
import { BeatSaverApi } from "../../entity/BeatSaverApi";
import { getMapTypeString } from "../../entity/MapPoolAndScores";
import { brands, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Loader from "../Loader";
import { useRequest } from "../Request";

export default function MapPoolElement() {
    const [loading, setLoading] = React.useState(true);
    const [pools, setPools] = React.useState<MapPool[]>([]);
    const getUrl = useRequest().getUrl;

    async function getMapFromBeatsaver(maps: Map[], mapKey: string) {
        return await (await fetch(`https://api.beatsaver.com/maps/id/${maps[mapKey as any].song_id}`)).json() as Promise<BeatSaverApi>;
    }

    useEffect(() => {
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
            });
        }).finally(() => setLoading(false));
    }, []);


    return (
        <>
            <Loader hide={!loading} />
            {!loading && pools.map((pool, index) => (
                <div key={index} className="card">
                    <header className="card-header d-flex justify-content-center">
                        <h4 className="card-header-title">Pool: {pool.name}</h4>
                        <button className="btn btn-danger ms-5"><FontAwesomeIcon icon={solid("trash")} /></button>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            <table className="table col-12">
                                <thead>
                                    <tr>
                                        <th className="col-3">Map</th>
                                        <th className="col-3">Difficulty</th>
                                        <th className="col-3">Mapper</th>
                                        <th className="col-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(pool.maps).map((map, index) => (
                                        <tr key={index}>
                                            <td>{map.beatsaver.metadata.songName}</td>
                                            <td>{getMapTypeString(map.type)}</td>
                                            <td>{map.beatsaver.metadata.levelAuthorName}</td>
                                            <td>
                                                <button className="btn btn-danger"><FontAwesomeIcon icon={solid("trash")} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}