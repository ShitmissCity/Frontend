import { BeatSaverApi } from "./BeatSaverApi";
import { User } from "./User";

export interface MapPool {
    id: number;
    name: string;
    description: string;
    image_url: string;
    maps: Map[];
}

export interface Map {
    id: number;
    song_id: string;
    type: MapType;
    scoresaber_id: number;
    scores: Score[];
    map_pool: MapPool;
    beatsaver: BeatSaverApi;
}

export interface Score {
    id: number;
    score: number;
    map: Map;
    user: User;
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