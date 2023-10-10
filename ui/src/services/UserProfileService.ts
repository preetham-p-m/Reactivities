import { User } from "../@types/User";
import { ApiService } from "./ApiService";

export const UserProfileService = {
  getProfile: (userName: string) =>
    ApiService.get<User>(`/UserProfile/${userName}`),
};
