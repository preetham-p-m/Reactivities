import { LoginUser, RegisterUser, AuthUser } from "../@types/Auth";
import { ApiService } from "./ApiService";

export const AccountService = {
  current: () => ApiService.get<AuthUser>("/account"),
  login: (user: LoginUser) => ApiService.post<AuthUser>("/account/login", user),
  register: (user: RegisterUser) =>
    ApiService.post<AuthUser>("/account/register", user),
  refreshToken: () => ApiService.post<AuthUser>("/account/refreshToken", {}),
};
