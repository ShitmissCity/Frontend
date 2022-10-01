import { Score } from "./MapPoolAndScores";

export interface User {
    id: number;
    username: string;
    discord_id: string;
    avatar_id: string;
    scoresaber_id: string;
    twitch_name: string;
    country: string;
    role: Role;
    team: Team;
    scores: Score[];
    invitations: Invitation[];
}

export interface Role {
    id: number;
    permission: Permission;
    position: string;
    user: User;
}

export interface Team {
    id: number;
    name: string;
    color: string;
    seed: number;
    avatar_url: string;
    leader: User;
    members: User[];
    invites: Invitation[];
}

export interface Invitation {
    id: number;
    team: Team;
    user: User;
    date: Date;
}

/**
 * The permissions a user can have as a flag enum.
 * @enum {number}
 * @readonly
 * @property {number} MapPooler - Are the ones responsible for the map pools.
 * @property {number} Coordinator - Are the ones responsible for the match flow.
 * @property {number} Developer - The ones who created this mess of code. (Yes im calling myself out)
 * @property {number} Admin - The ones who can do everything.
 * @property {number} Owner - The one who can do everything and more.
 */
export enum Permission {
    MapPooler = 1,
    Coordinator = 2,
    Developer = 4,
    Admin = 8,
    Owner = 16,
}