import React, { useEffect, useState } from "react";
import { MapPool, Map, User } from "../../entity";
import { BeatSaverApi } from "../../entity/BeatSaverApi";
import { getMapTypeString, Score } from "../../entity/MapPoolAndScores";
import Dropdown from "../Dropdown";
import Loader from "../Loader";
import { useRequest } from "../Request";

export default function Qualifier() {
    const [pools, setPools] = useState<MapPool[]>([]);
    const [beatsaver, setBeatsaver] = useState<{ id: string, data: BeatSaverApi }[]>([]);
    const [qualifier, setQualifier] = useState<number>(undefined);
    const [loading, setLoading] = useState(true);
    const getUrl = useRequest().getUrl;

    async function getMapFromBeatsaver(mapKey: string) {
        return await (await fetch(`https://api.beatsaver.com/maps/id/${mapKey}`)).json() as Promise<BeatSaverApi>;
    }

    function getBeatSaberData() {
        if (qualifier > 0) {
            let threads: { id: string, thread: Promise<BeatSaverApi> }[] = [];
            let maps = pools.find(p => p.id === qualifier).maps;
            for (const m of maps) {
                if (!threads.map(t => t.id).includes(m.song_id))
                    threads.push({ id: m.song_id, thread: getMapFromBeatsaver(m.song_id) });
            }
            Promise.all(threads.map(t => t.thread)).then(async () => {
                let bs: { id: string, data: BeatSaverApi }[] = [];
                for (const t of threads) {
                    bs.push({ id: t.id, data: await t.thread });
                }
                setBeatsaver(bs);
            });
        }
    }

    useEffect(() => {
        getUrl("/authorized/mappool").then(res => res.json() as Promise<MapPool[]>).then(setPools);
    }, [getUrl]);

    useEffect(() => {
        for (const p of pools) {
            if (p.is_qualifier) {
                setQualifier(p.id);
                break;
            }
        }
        setLoading(false);
    }, [pools]);

    useEffect(() => {
        getBeatSaberData();
    }, [qualifier]);

    async function setQualifierPool(id: number) {
        if (pools.find(p => p.is_qualifier))
            await getUrl(`/authorized/mappool/${pools.find(p => p.is_qualifier).id}/setqualifier`, { method: "POST", body: JSON.stringify({ is_qualifier: false }), headers: { "Content-Type": "application/json" } });
        if (id != 0) {
            const res = await getUrl(`/authorized/mappool/${id}/setqualifier`, { method: "POST", body: JSON.stringify({ is_qualifier: true }), headers: { "Content-Type": "application/json" } });
            if (res.ok) {
                setQualifier(id);
                getBeatSaberData();
            }
        }
        else {
            setQualifier(undefined);
        }
    }

    function getBeatsaver(song_id: string) {
        return beatsaver.find(b => b.id == song_id);
    }

    function formatSeconds(seconds: number) {
        let date = new Date(0);
        date.setSeconds(seconds);
        return date.toISOString().substring(14, 19);
    }

    function getSubName(song: BeatSaverApi) {
        let str = "";
        if (song.metadata.songSubName)
            str = "(" + song.metadata.songSubName + ")";
        return str.replaceAll("((", "(").replaceAll("))", ")");
    }

    function getUsersMapOfScores(scores: Score[]) {
        let users: { user: User, scores: Score[] }[] = [];
        for (const s of scores) {
            let user = users.find(u => u.user.id === s.player.id);
            if (!user) {
                users.push({ user: s.player, scores: [s] });
            }
            else {
                user.scores.push(s);
            }
        }
        return users;
    }

    return (
        <>
            <Loader hide={!loading} />
            <div className="d-flex justify-content-between mb-2">
                {qualifier > 0 ? <h3 className="text-center">Current qualifier: {pools.find(p => p.id === qualifier).name}</h3> : <h3 className="text-center">No qualifier set</h3>}
                <div className="d-flex">
                    {qualifier > 0 && <div><button className="btn btn-danger me-2" onClick={() => setQualifierPool(0)}>Remove qualifier</button></div>}
                    <Dropdown elements={pools.map(p => { return { key: p.id, value: p.name } })} title="Pools" onChange={setQualifierPool} />
                </div>
            </div>
            <div style={{ maxWidth: "80vw", marginLeft: "auto", marginRight: "auto" }}>
                {qualifier > 0 && pools.find(p => p.id === qualifier).maps.map(m => getBeatsaver(m.song_id) &&
                    <div className="card mb-3 p-2">
                        <div className="d-flex justify-content-center">
                            <span className="me-5">{getBeatsaver(m.song_id).data.metadata.songName} <sub>{getSubName(getBeatsaver(m.song_id).data)}</sub></span>
                            <span className="me-5">Scores: {m.scores.length}</span>
                            <span>Users: {m.scores.reduce((acc, t) => { if (!acc.includes(t.player.id)) acc.push(t.player.id); return acc; }, []).length}</span>
                        </div>
                        <div className="d-flex justify-content-center">
                            <span className="me-5">Difficulty: {getMapTypeString(m.type)}</span>
                            <span className="me-5">BPM: {getBeatsaver(m.song_id).data.metadata.bpm}</span>
                            <span>Duration: {formatSeconds(getBeatsaver(m.song_id).data.metadata.duration)}</span>
                        </div>
                        <div className="mt-3">
                            {getUsersMapOfScores(m.scores).map(u => <div className="d-flex justify-content-center">
                                <span className="me-5">{u.user.username}</span>
                                <span className="me-5">Scores: {u.scores.length}</span>
                                <span>Best score: {u.scores.reduce((acc, t) => { if (t.score > acc) acc = t.score; return acc; }, 0)}</span>
                            </div>)}
                        </div>
                    </div>)}
            </div>
        </>
    );
}