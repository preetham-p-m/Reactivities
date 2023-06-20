import { Profile } from "../@types/Profile";
import { ApiService } from "./ApiService";

export const UserProfileService = {
    getProfile: (userName: string) => ApiService.get<Profile>(`/UserProfile/${userName}`)
};