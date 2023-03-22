import React, { useState, useEffect } from "react";
import BackgroundContainer from "../components/Background";
import Loader from "../components/Loader";
import { useRequest } from "../components/Request";
import { useTitle } from "../components/Title";
import { Bracket, IRoundProps, IRenderSeedProps, Seed, SeedItem, SeedTeam, SingleLineSeed } from "react-brackets";
import { Brackets } from "../entity/Bracket";

type res = (value: Response) => void;

export default function Teams() {
    const { setTitle } = useTitle();
    const [loading, setLoading] = useState(true);
    const [bracket, setBracket] = useState<IRoundProps[][]>([[], []]);
    const getUrl = useRequest().getUrl;

    useEffect(() => {
        setTitle("Bracket");
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

    }, [setTitle]);

    return (
        <>
            <Loader hide={!loading} />
            <BackgroundContainer size="small">
                <div className="hero-body">
                    <div className="container" style={{ width: "71%" }}>
                        <h1 className="title">
                            Bracket
                        </h1>
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

const CustomSeed = ({ seed, breakpoint, roundIndex, seedIndex, rounds }: IRenderSeedProps) => {
    const isLineConnector = rounds[roundIndex].seeds.length === rounds[roundIndex + 1]?.seeds.length;

    const Wrapper = isLineConnector ? SingleLineSeed : Seed;

    let winner = seed.teams[0].score > seed.teams[1].score ? 0 : 1;

    if (seed.teams[0].score === seed.teams[1].score)
        winner = -1;
    return (
        <Wrapper>
            <SeedItem>
                <div>
                    <SeedTeam style={{ justifyContent: "unset", backgroundColor: winner === 0 ? "green" : "inherit" }}><small style={{ width: 25, color: "#bbbbbb", marginRight: ".5rem" }}>#{seed.teams[0].seed}</small>{seed.teams[0].name}<small style={{ marginLeft: "auto" }}>{seed.teams[0].score >= 0 ? seed.teams[0].score : "DNM"}</small></SeedTeam>
                    <SeedTeam style={{ justifyContent: "unset", backgroundColor: winner === 1 ? "green" : "inherit" }}><small style={{ width: 25, color: "#bbbbbb", marginRight: ".5rem" }}>#{seed.teams[1].seed}</small>{seed.teams[1].name}<small style={{ marginLeft: "auto" }}>{seed.teams[1].score >= 0 ? seed.teams[1].score : "DNM"}</small></SeedTeam>
                </div>
            </SeedItem>
        </Wrapper>
    )
}

const CustomTitle = (title: string | JSX.Element, roundIdx: number): JSX.Element => {
    return (
        <div style={{ backgroundColor: "#222222", textAlign: "center", borderRadius: ".25rem", marginLeft: ".5rem", marginRight: ".5rem", color: "#bbbbbb" }}>{title}</div>
    )
}