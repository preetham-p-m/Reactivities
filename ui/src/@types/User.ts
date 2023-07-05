import { AuthUser } from "./Auth";

export interface User {
    userName: string;
    displayName: string;
    bio?: string;
    image?: string;
    photos?: Photo[];
    followingCount: number;
    followersCount: number;
    following: boolean;
}

export class User implements User {
    constructor(user: AuthUser) {
        this.userName = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}