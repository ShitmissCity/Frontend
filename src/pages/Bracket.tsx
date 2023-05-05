import React, { useState, useEffect } from "react";
import BackgroundContainer from "../components/Background";
import Loader from "../components/Loader";
import { useRequest } from "../components/Request";
import { useTitle } from "../components/Title";
import { Bracket, IRoundProps, IRenderSeedProps, Seed, SeedItem, SeedTeam, SingleLineSeed, ISeedProps } from "react-brackets";
import { Brackets } from "../entity/Bracket";
import { Permission } from "../entity/User";
import { useAuth } from "../components/Auth";
import { useModal } from "../components/Modal";

export default function Teams() {
    const { setTitle } = useTitle();
    const [loading, setLoading] = useState(true);
    const [bracket, setBracket] = useState<IRoundProps[][]>([[], []]);
    const [editMatchData, setEditMatchData] = useState<{ id: number, name: string, score: number, seed: string, matchId: number }[]>([]);
    const { openModal, closeModal } = useModal();
    const { user } = useAuth();
    const getUrl = useRequest().getUrl;

    useEffect(() => {
        setTitle("Bracket");
        loadBracket();
    }, [setTitle]);

    useEffect(() => {
        if (editMatchData.length > 0)
            openModal("Editing match between seed " + editMatchData[0].seed + " and " + editMatchData[1].seed, <MatchEditingModal matchData={editMatchData} setMatchData={setEditMatchData} />, <>
                <button className="btn btn-primary" onClick={() => saveMatch(editMatchData[0].matchId, editMatchData)}>Save</button>
                <button className="btn btn-danger" onClick={() => { closeModal(); setEditMatchData([]); }}>Close</button>
            </>);
    }, [editMatchData])

    function loadBracket() {
        getUrl("/public/bracket").then((res: Response) => {
            return new Promise((resolve: (value: Response) => void, reject: (value: Response) => void) => {
                if (res.ok) {
                    resolve(res);
                } else {
                    reject(res);
                }
            })
        }).then(res => res.json()).then((res: Brackets) => {
            var losersBracket = res.rounds.filter(t => t.losers).map(t => {
                return {
                    title: t.name,
                    seeds: t.matches.map(s => {
                        return {
                            id: s.id,
                            teams: s.matchUsers.map(t => {
                                return {
                                    name: t.name,
                                    seed: t.seed,
                                    score: t.score
                                }
                            })
                        }
                    })
                }
            });
            var winnersBracket = res.rounds.filter(t => !t.losers).map(t => {
                return {
                    title: t.name,
                    seeds: t.matches.map(s => {
                        return {
                            id: s.id,
                            teams: s.matchUsers.map(t => {
                                return {
                                    id: t.id,
                                    name: t.name,
                                    seed: t.seed,
                                    score: t.score
                                }
                            })
                        }
                    })
                }
            });
            setBracket([winnersBracket, losersBracket]);
        }).catch(() => {

        }).finally(() => {
            setLoading(false);
        });
    }

    function saveMatch(match: number, users: { id: number, name: string, score: number }[]) {
        getUrl("/authorized/bracket/update", { method: "PUT", body: JSON.stringify({ match, users }), headers: { "Content-Type": "application/json" } }).then(res => {
            if (res.ok) {
                closeModal();
                setEditMatchData([]);
                loadBracket();
            }
        })
    }

    function editSeed(seed: ISeedProps) {
        if (Permission.isRole(user.role.permissions, Permission.Coordinator))
            setEditMatchData(seed.teams.map(t => {
                return {
                    matchId: seed.id as number,
                    id: t.id,
                    seed: t.seed,
                    name: t.name,
                    score: t.score
                }
            }));
    }

    const CustomSeed = ({ seed, breakpoint, roundIndex, seedIndex, rounds }: IRenderSeedProps) => {
        const isLineConnector = rounds[roundIndex].seeds.length === rounds[roundIndex + 1]?.seeds.length;

        const Wrapper = isLineConnector ? SingleLineSeed : Seed;

        let winner = seed.teams[0].score > seed.teams[1].score ? 0 : 1;

        if (seed.teams[0].score === seed.teams[1].score)
            winner = -1;
        return (
            <Wrapper>
                <SeedItem onClick={() => editSeed(seed)}>
                    <SeedTeam style={{ justifyContent: "unset", backgroundColor: winner === 0 ? "green" : "inherit" }}><small style={{ width: 25, color: "#bbbbbb", marginRight: ".5rem" }}>#{seed.teams[0].seed}</small>{seed.teams[0].name}<small style={{ marginLeft: "auto" }}>{seed.teams[0].score >= 0 ? seed.teams[0].score : "DNM"}</small></SeedTeam>
                    <SeedTeam style={{ justifyContent: "unset", backgroundColor: winner === 1 ? "green" : "inherit" }}><small style={{ width: 25, color: "#bbbbbb", marginRight: ".5rem" }}>#{seed.teams[1].seed}</small>{seed.teams[1].name}<small style={{ marginLeft: "auto" }}>{seed.teams[1].score >= 0 ? seed.teams[1].score : "DNM"}</small></SeedTeam>
                </SeedItem>
            </Wrapper>
        )
    }

    const CustomTitle = (title: string | JSX.Element, roundIdx: number): JSX.Element => {
        return (
            <div style={{ backgroundColor: "#222222", textAlign: "center", borderRadius: ".25rem", marginLeft: ".5rem", marginRight: ".5rem", color: "#bbbbbb" }}>{title}</div>
        )
    }

    return (
        <>
            <Loader hide={!loading} />
            <BackgroundContainer size="small">
                <div className="hero-body">
                    <div className="container d-flex" style={{ width: "71%" }}>
                        <h1 className="title">
                            Bracket
                        </h1>
                        {user && user.role && Permission.isRole(user.role.permissions, Permission.Admin) &&
                            <div className="ms-auto d-flex align-items-center">
                                <button className="btn btn-danger">Create new bracket</button>
                            </div>}
                    </div>
                </div>
            </BackgroundContainer>
            <div className="container-fluid" style={{ paddingLeft: "5rem", paddingRight: "5rem" }}>
                <Bracket rounds={bracket[0]} renderSeedComponent={CustomSeed} roundTitleComponent={CustomTitle} bracketClassName="justify-content-center" />
                <div style={{ height: 20, width: "100%" }} />
                <Bracket rounds={bracket[1]} renderSeedComponent={CustomSeed} roundTitleComponent={CustomTitle} bracketClassName="justify-content-center" />
            </div>
        </>
    );
}

function MatchEditingModal(props: { matchData: { id: number, name: string, score: number, seed: string, matchId: number }[], setMatchData: React.Dispatch<React.SetStateAction<{ id: number, name: string, score: number, seed: string, matchId: number }[]>> }) {
    const [editMatchData, setEditMatchData] = useState(props.matchData);

    useEffect(() => {
        setEditMatchData(props.matchData);
    }, [props.matchData]);

    useEffect(() => {
        props.setMatchData(editMatchData);
    }, [editMatchData]);

    return (
        <form>
            <div className="mb-3">
                <label htmlFor="team1" className="form-label">Team 1</label>
                <input type="text" className="form-control" id="team1" value={editMatchData[0].name} onChange={(e) => {
                    e.preventDefault();
                    setEditMatchData([{ id: editMatchData[0].id, name: e.currentTarget.value, score: editMatchData[0].score, seed: editMatchData[0].seed, matchId: editMatchData[0].matchId }, { id: editMatchData[1].id, name: editMatchData[1].name, score: editMatchData[1].score, seed: editMatchData[1].seed, matchId: editMatchData[0].matchId }]);
                }} />
            </div>
            <div className="mb-3">
                <label htmlFor="team2" className="form-label">Team 2</label>
                <input type="text" className="form-control" id="team2" value={editMatchData[1].name} onChange={(e) => {
                    e.preventDefault();
                    setEditMatchData([{ id: editMatchData[0].id, name: editMatchData[0].name, score: editMatchData[0].score, seed: editMatchData[0].seed, matchId: editMatchData[0].matchId }, { id: editMatchData[1].id, name: e.currentTarget.value, score: editMatchData[1].score, seed: editMatchData[1].seed, matchId: editMatchData[0].matchId }]);
                }} />
            </div>
            <div className="mb-3">
                <label htmlFor="score1" className="form-label">Score 1</label>
                <input type="number" className="form-control" id="score1" value={editMatchData[0].score} min={-1} max={11} onChange={(e) => {
                    e.preventDefault();
                    setEditMatchData([{ id: editMatchData[0].id, name: editMatchData[0].name, score: parseInt(e.currentTarget.value), seed: editMatchData[0].seed, matchId: editMatchData[0].matchId }, { id: editMatchData[1].id, name: editMatchData[1].name, score: editMatchData[1].score, seed: editMatchData[1].seed, matchId: editMatchData[0].matchId }])
                }} />
            </div>
            <div className="mb-3">
                <label htmlFor="score2" className="form-label">Score 2</label>
                <input type="number" className="form-control" id="score2" value={editMatchData[1].score} min={-1} max={11} onChange={(e) => {
                    e.preventDefault();
                    setEditMatchData([{ id: editMatchData[0].id, name: editMatchData[0].name, score: editMatchData[0].score, seed: editMatchData[0].seed, matchId: editMatchData[0].matchId }, { id: editMatchData[1].id, name: editMatchData[1].name, score: parseInt(e.currentTarget.value), seed: editMatchData[1].seed, matchId: editMatchData[0].matchId }])
                }} />
            </div>
        </form>
    )
}