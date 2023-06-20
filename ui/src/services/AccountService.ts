import { LoginUser, RegisterUser, User } from "../@types/User";
import { ApiService } from "./ApiService";

export const AccountService = {
    current: () => ApiService.get<User>("/account"),
    login: (user: LoginUser) => ApiService.post<User>("/account/login", user),
    register: (user: RegisterUser) => ApiService.post<User>("/account/register", user)
};