import { BeatSaverApi } from "./BeatSaverApi";
import { User } from "./User";

export interface MapPool {
    id: number;
    name: string;
    description: string;
    image_url: string;
    maps: Map[];
    is_qualifier: boolean;
}

export interface Map {
    id: number;
    song_id: string;
    type: MapType;
    scoresaber_id: number;
    scores: Score[];
    map_pool: MapPool;
    hash: string;
    beatsaver: BeatSaverApi;
}

export interface Score {
    id: number;
    score: number;
    map: Map;
    player: User;
}

/**
 * Map type
 * If the map only has one of Easy, Normal, Hard, Expert, ExpertPlus, it is a Standard Characteristic map
 */
export enum MapType {
    OneSaber = 1,
    NoArrows = 2,
    Degree90 = 4,
    Degree360 = 8,
    Lightshow = 16,
    Lawless = 32,
    Easy = 64,
    Normal = 128,
    Hard = 256,
    Expert = 512,
    ExpertPlus = 1024
}

export function getMapTypeFromCharaString(v: string): MapType {
    switch (v) {
        case "OneSaber":
            return MapType.OneSaber;
        case "NoArrows":
            return MapType.NoArrows;
        case "Degree90":
            return MapType.Degree90;
        case "Degree360":
            return MapType.Degree360;
        case "Lightshow":
            return MapType.Lightshow;
        case "Lawless":
            return MapType.Lawless;
    }
    return 0;
}

export function getCharaStringFromMapType(v: MapType): string {
    switch (v & (MapType.OneSaber | MapType.NoArrows | MapType.Degree90 | MapType.Degree360 | MapType.Lightshow | MapType.Lawless)) {
        case MapType.OneSaber:
            return "OneSaber";
        case MapType.NoArrows:
            return "NoArrows";
        case MapType.Degree90:
            return "Degree90";
        case MapType.Degree360:
            return "Degree360";
        case MapType.Lightshow:
            return "Lightshow";
        case MapType.Lawless:
            return "Lawless";
    }
    return "Standard";
}

export function getMapTypeFromDifString(v: string): MapType {
    switch (v) {
        case "Easy":
            return MapType.Easy;
        case "Normal":
            return MapType.Normal;
        case "Hard":
            return MapType.Hard;
        case "Expert":
            return MapType.Expert;
        case "ExpertPlus":
            return MapType.ExpertPlus;
    }
    return 0;
}

export function getDifStringFromMapType(v: MapType): string {
    switch (v & (MapType.Easy | MapType.Normal | MapType.Hard | MapType.Expert | MapType.ExpertPlus)) {
        case MapType.Easy:
            return "Easy";
        case MapType.Normal:
            return "Normal";
        case MapType.Hard:
            return "Hard";
        case MapType.Expert:
            return "Expert";
        case MapType.ExpertPlus:
            return "ExpertPlus";
    }
    return "";
}

export function getMapTypeString(mapType: MapType): string {
    switch (mapType & (MapType.Easy | MapType.Normal | MapType.Hard | MapType.Expert | MapType.ExpertPlus)) {
        case MapType.Easy:
            return "Easy";
        case MapType.Normal:
            return "Normal";
        case MapType.Hard:
            return "Hard";
        case MapType.Expert:
            return "Expert";
        case MapType.ExpertPlus:
            return "Expert+";
    }
}

export function getMapTypeColor(mapType: MapType): string {
    switch (mapType & (MapType.Easy | MapType.Normal | MapType.Hard | MapType.Expert | MapType.ExpertPlus)) {
        case MapType.Easy:
            return "#3cb371";
        case MapType.Normal:
            return "#59b0f4";
        case MapType.Hard:
            return "tomato";
        case MapType.Expert:
            return "#bf2a42";
        case MapType.ExpertPlus:
            return "#8f48db";
    }
}

export function getScorePercentage(score: Score, map: Map): number {
    return Math.round(score.score / map.beatsaver.versions.find(t => t.hash == map.hash).diffs.find(t => t.characteristic == getCharaStringFromMapType(map.type) && t.difficulty == getDifStringFromMapType(map.type)).maxScore * 10000) / 100;
}

export function getScorePercentageRelative(score: Score, scores: Score[]): number {
    return Math.round(score.score / scores.sort((a, b) => b.score - a.score)[0].score * 10000) / 100;
}

export function getTeamScores(map: Map): Score[] {
    let teams = map.scores.map(t => t.player.team).filter((v, i, a) => a.indexOf(v) === i);
    let teamScores: Score[] = [];
    for (let team of teams) {
        let teamScore = 0;
        let teamScoreCount = 0;
        for (let score of map.scores) {
            if (score.player.team == team && teamScoreCount < 2) {
                teamScore += score.score;
                teamScoreCount++;
            }
        }
        teamScores.push({
            id: 0,
            score: teamScore / 2,
            map: map,
            player: {
                id: 0,
                username: team.name,
                discord_id: "",
                avatar_id: "",
                country: "",
                invitations: [],
                role: null,
                scores: [],
                scoresaber_id: "",
                twitch_name: "",
                team: team
            }
        });
    }
    return teamScores;
}