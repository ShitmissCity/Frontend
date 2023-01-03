import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useRef, ReactNode } from "react";
import { MapPool, Map } from "../../entity";
import { BeatSaverApi } from "../../entity/BeatSaverApi";
import { getMapTypeFromCharaString, getMapTypeFromDifString, getMapTypeString, MapType } from "../../entity/MapPoolAndScores";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Loader from "../Loader";
import { useRequest } from "../Request";
import { useModal } from "../Modal";
import "./MapPool.scss";

export default function MapPoolElement() {
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(true);
    const [pools, setPools] = useState<MapPool[]>([]);
    const [currentSongAdd, setCurrentSongAdd] = useState<{ id: number, map: BeatSaverApi, hash: string }>({ id: -1, map: null, hash: null });
    const { openModal, closeModal } = useModal();
    const getUrl = useRequest().getUrl;

    async function getMapFromBeatsaver(maps: Map[], mapKey: string) {
        return await (await fetch(`https://api.beatsaver.com/maps/id/${maps[mapKey as any].song_id}`)).json() as Promise<BeatSaverApi>;
    }

    function getSubName(song: BeatSaverApi) {
        let str = "";
        if (song.metadata.songSubName)
            str = "(" + song.metadata.songSubName + ")";
        return str.replaceAll("((", "(").replaceAll("))", ")");
    }

    function formatSeconds(seconds: number) {
        let date = new Date(0);
        date.setSeconds(seconds);
        return date.toISOString().substring(14, 19);
    }

    function getMapPools() {
        getUrl("/authorized/mappool").then(res => res.json() as Promise<MapPool[]>).then(res => {
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
    }

    useEffect(() => {
        getMapPools();
    }, []);

    useEffect(() => {
        if (currentSongAdd.id !== -1) {
            var pool = pools.find(p => p.id === currentSongAdd.id);
            var map = currentSongAdd.map;
            var version = map.versions[0];
            if (version.diffs.length === 1) {
                var diff = version.diffs[0];
                openModal(<h3 className="title">Add {map.metadata.songName} <sub>{getSubName(map)}</sub> to <i>{pool.name}</i></h3>,
                    <form ref={formRef}>
                        <div className="mb-3 form-floating input-group">
                            <input type="text" className="form-control" id="songId" disabled value={map.id} placeholder="tmp" />
                            <label htmlFor="songId" className="form-label">Song ID</label>
                            <button className="btn btn-outline-primary" type="button" onClick={() => window.open(`https://beatsaver.com/maps/${map.id}`, "_blank")}><FontAwesomeIcon icon={solid("compact-disc")} /></button>
                        </div>
                        <div className="mb-3 input-group">
                            <div className="col-12">
                                <label className="form-label">{diff.characteristic}</label>
                            </div>
                            <div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="mapTypeRadio" id={`mapTypeRadio${diff.characteristic + diff.difficulty}`} value={diff.difficulty} checked readOnly />
                                    <label className="form-check-label" htmlFor={`mapTypeRadio${diff.characteristic + diff.difficulty}`}>{getMapTypeString(getMapTypeFromDifString(diff.difficulty))}</label>
                                </div>
                            </div>
                        </div>
                    </form>,
                    <>
                        <button type="button" className="btn btn-success" onClick={putSongToPool}>Add Song</button>
                        <button type="button" className="btn btn-danger" onClick={closeAndClear}>Close</button>
                    </>);
            }
            else {
                openModal(<h3 className="title">Add {map.metadata.songName}<sub>{map.metadata.songSubName}</sub> to <i>{pool.name}</i></h3>,
                    <form ref={formRef}>
                        <div className="mb-3 form-floating input-group">
                            <input type="text" className="form-control" id="songId" disabled value={map.id} placeholder="tmp" />
                            <label htmlFor="songId" className="form-label">Song ID</label>
                            <button className="btn btn-outline-primary" type="button" onClick={() => window.open(`https://beatsaver.com/maps/${map.id}`, "_blank")}><FontAwesomeIcon icon={solid("compact-disc")} /></button>
                        </div>
                        {version.diffs.reduce<{ key: string, val: MapType[] }[]>((acc, cur) => {
                            var chara = acc.find(v => v.key === cur.characteristic);
                            if (!chara) {
                                chara = { key: cur.characteristic, val: [] };
                                acc.push(chara);
                            }
                            chara.val.push(getMapTypeFromDifString(cur.difficulty));
                            return acc;
                        }, []).map(v => <div className="mb-3 input-group" key={v.key}>
                            <div className="col-12">
                                <label className="form-label">{v.key}</label>
                            </div>
                            <div>
                                {v.val.map(t =>
                                    <div className="form-check form-check-inline" key={t}>
                                        <input className="form-check-input" type="radio" name="mapTypeRadio" id={`mapTypeRadio${v.key + t}`} value={t} />
                                        <label className="form-check-label" htmlFor={`mapTypeRadio${v.key + t}`}>{getMapTypeString(t)}</label>
                                    </div>
                                )}
                            </div>
                        </div>)}
                    </form>,
                    <>
                        <button type="button" className="btn btn-success" onClick={putSongToPool}>Add Song</button>
                        <button type="button" className="btn btn-danger" onClick={closeAndClear}>Close</button>
                    </>);
            }
        }
    }, [currentSongAdd]);

    function closeAndClear() {
        closeModal();
        setCurrentSongAdd({ id: -1, map: null, hash: null });
    }

    function getScoreSaberDiff(diff: string) {
        switch (diff) {
            case "Easy":
                return 1;
            case "Normal":
                return 3;
            case "Hard":
                return 5;
            case "Expert":
                return 7;
            case "Expert+":
                return 9;
        }
    }

    async function putSongToPool() {
        let form = formRef.current as HTMLFormElement;
        let map = currentSongAdd.map;
        let pool = currentSongAdd.id;
        let hash = map.versions[0].hash;
        let tmpScoresaber = `https://scoresaber.com/api/leaderboard/by-hash/${hash}/info?difficulty=`;
        let body = { id: map.id, hash, type: 0, scoresaberId: 0 };
        if (map.versions[0].diffs.length === 1) {
            let mapType = getMapTypeFromDifString(map.versions[0].diffs[0].difficulty);
            body.type = mapType | getMapTypeFromCharaString(map.versions[0].diffs[0].characteristic);
            let scoresaber = `${tmpScoresaber}${getScoreSaberDiff(getMapTypeString(mapType))}&gameMode=Solo${map.versions[0].diffs[0].characteristic}`;
            body.scoresaberId = (await (await fetch(scoresaber)).json()).id;
        }
        else {
            var radioBtn = form.querySelector("input[name=mapTypeRadio]:checked") as HTMLInputElement;
            let mapTypeString = radioBtn.id.replace("mapTypeRadio", "");
            let mapTypeDif = form.mapTypeRadio.value as string;
            let mapType = parseInt(mapTypeDif) as MapType;
            let chara = mapTypeString.substring(0, mapTypeString.length - mapTypeDif.length);
            body.type = mapType | getMapTypeFromCharaString(chara);
            let scoresaber = `${tmpScoresaber}${getScoreSaberDiff(getMapTypeString(mapType))}&gameMode=Solo${chara}`
            body.scoresaberId = (await (await fetch(scoresaber)).json()).id;
        }
        await getUrl(`/authorized/mappool/${pool}/add`, { body: JSON.stringify(body), method: "PUT", headers: { "Content-Type": "application/json" } });
        closeModal();
        setCurrentSongAdd({ id: -1, map: null, hash: null });
        getMapPools();
    }

    async function delSongFromPool(poolId: number, mapId: number) {
        await getUrl(`/authorized/mappool/${poolId}/remove/${mapId}`, { method: "DELETE" });
        getMapPools();
    }

    function getSongFromInput(input: HTMLInputElement) {
        let value = input.value.toLowerCase();
        if (/[0-9a-f]/g.test(value)) {
            if (value.length === 40) {
                return `https://api.beatsaver.com/maps/hash/${value}`;
            }
            else {
                return `https://api.beatsaver.com/maps/id/${value}`;
            }
        }
        return null;
    }

    async function createMapPoolRequest() {
        let form = formRef.current as HTMLFormElement;
        let name = (form.name as any).value;
        let description = form.description.value;
        let image_url = form.image_url.value;
        let obj = { name, description, image_url };
        await getUrl("/authorized/mappool/create", { method: "PUT", body: JSON.stringify(obj), headers: { "Content-Type": "application/json" } });
        closeModal();
        getMapPools();
    }

    async function addSongToPool(id: number, input: HTMLInputElement) {
        var result = await (await fetch(getSongFromInput(input))).json() as BeatSaverApi;
        var hash = undefined;
        if (result.versions.length === 1) {
            hash = result.versions[0].hash;
        }
        setCurrentSongAdd({ id: id, map: result, hash: hash });
        input.value = "";
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function createMapPool() {
        openModal(<h1 className="title">Create new map pool</h1>,
            <form ref={formRef}>
                <div className="mb-3 form-floating">
                    <input type="text" className="form-control" id="name" placeholder="name" autoComplete="fuck-off-autofill" />
                    <label htmlFor="name" className="form-label">Pool name</label>
                </div>
                <div className="mb-3 form-floating">
                    <input type="text" className="form-control" id="description" placeholder="description" autoComplete="fuck-off-autofill" />
                    <label htmlFor="description" className="form-label">Pool description</label>
                </div>
                <div className="mb-3 form-floating">
                    <input type="text" className="form-control" id="image_url" placeholder="image" autoComplete="fuck-off-autofill" />
                    <label htmlFor="image_url" className="form-label">Pool image</label>
                </div>
            </form>,
            <>
                <button type="button" className="btn btn-success" onClick={createMapPoolRequest}>Create</button>
                <button type="button" className="btn btn-danger" onClick={closeModal}>Close</button>
            </>);
    }

    async function deletePool(poolId: number) {
        await getUrl(`/authorized/mappool/${poolId}`, { method: "DELETE" });
        closeModal();
        getMapPools();
    }

    function confirmDelete(title: ReactNode, func: () => void) {
        openModal(<h3 className="title">Delete {title}</h3>,
            null,
            <>
                <button type="button" className="btn btn-danger" onClick={() => func()}>Delete</button>
                <button type="button" className="btn btn-success" onClick={closeModal}>Cancel</button>
            </>);
    }

    return (
        <>
            <Loader hide={!loading} />
            <button type="button" className="btn btn-primary" onClick={createMapPool}>Create new map pool <FontAwesomeIcon icon={solid("plus")} /></button>
            {!loading && pools.map((pool, index) => (
                <div key={index} className="card p-2 mt-3">
                    <header className="card-header d-flex justify-content-center">
                        <h4 className="card-header-title">Pool: {pool.name}</h4>
                        <button type="button" className="btn btn-danger ms-5" onClick={() => confirmDelete(<>pool: {pool.name}</>, () => deletePool(pool.id))}>Delete pool <FontAwesomeIcon icon={solid("trash")} /></button>
                    </header>
                    <div className="card-content mt-2">
                        <div className="content">
                            <table className="table col-12 border-bottom border-gray-500">
                                <thead>
                                    <tr>
                                        <th className="col-2">Map</th>
                                        <th className="col-2">Difficulty</th>
                                        <th className="col-2">Length</th>
                                        <th className="col-2">Mapper</th>
                                        <th className="col-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pool.maps.map((map, index) => (
                                        <tr key={index} className="border-top border-gray-500">
                                            <td className="pb-2 pt-2">{map.beatsaver.metadata.songName}</td>
                                            <td className="pb-2 pt-2">{getMapTypeString(map.type)}</td>
                                            <td className="pb-2 pt-2">{formatSeconds(map.beatsaver.metadata.duration)}</td>
                                            <td className="pb-2 pt-2">{map.beatsaver.metadata.levelAuthorName}</td>
                                            <td className="pb-2 pt-2">
                                                <button type="button" className="btn btn-danger" onClick={() => confirmDelete(<>map: {map.beatsaver.metadata.songName}<br />from <i>{pool.name}</i></>, () => delSongFromPool(pool.id, map.id))}>Delete from pool <FontAwesomeIcon icon={solid("trash")} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-center mt-3">
                                <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-9 col-12">
                                    <div className="input-group">
                                        <input type="text" className="form-control text-center" placeholder="ID or Hash" onBlur={(e) => addSongToPool(pool.id, e.target)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}