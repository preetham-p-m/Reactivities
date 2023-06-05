import { LoginUser, RegisterUser, User } from "../@types/User";
import { request } from "./ApiService";

export const AccountService = {
    current: () => request.get<User>("/account"),
    login: (user: LoginUser) => request.post<User>("/account/login", user),
    register: (user: RegisterUser) => request.post<User>("/account/register", user)
}