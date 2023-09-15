export interface Brackets {
    id: number;

    name: string;

    active: boolean;

    date: Date;

    rounds: Rounds[];
}


export interface Rounds {
    id: number;

    name: string;

    date: Date;

    losers: boolean;

    bracket: Brackets;

    matches: Matches[];
}


export interface Matches {
    id: number;

    date: Date;

    round: Rounds;

    matchUsers: MatchUser[];
}


export interface MatchUser {
    id: number;

    name: string;

    seed: number;

    score: number;

    match: Matches;
}