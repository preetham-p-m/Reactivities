import { User } from "../@types/User";
import { ApiService } from "./ApiService";

export const FollowService = {
    updateFollowing: (userName: string) => ApiService.post(`/follow/${userName}`, {}),
    listFollowing: (userName: string, predicate: string) => ApiService.get<User[]>(`/follow/${userName}?predicate=${predicate}`)
};