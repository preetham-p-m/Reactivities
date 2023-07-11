import { makeAutoObservable, runInAction } from "mobx";
import { LoginUser, RegisterUser, AuthUser } from "../@types/Auth";
import { AccountService } from "../Services/AccountService";
import { store } from "./Store";
import { router } from "../utils/router/Routes";
import { routerPath } from "../utils/router/routerPath";

export default class AuthStore {
    user: AuthUser | null = null;
    refreshTokenTimeout: any;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    register = async (creds: RegisterUser) => {
        try {
            const user = await AccountService.register(creds);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            runInAction(() => this.user = user);
            router.navigate(`/${routerPath.ACTIVITIES}`);
            store.modalStore.closeModal();
        } catch (error) {
            throw (error);
        }
    };

    login = async (creds: LoginUser) => {
        try {
            const user = await AccountService.login(creds);
            this.startRefreshTokenTimer(user);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate(`/${routerPath.ACTIVITIES}`);
            store.modalStore.closeModal();
        } catch (error) {
            throw (error);
        }
    };

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate("/");
    };

    getUser = async () => {
        try {
            const user = await AccountService.current();
            runInAction(() => this.user = user);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    };

    setImage = (image: string) => {
        if (this.user) {
            this.user.image = image;
        }
    };

    refreshToken = async () => {
        this.stopRefreshTokenTimer();
        try {
            const user = await AccountService.refreshToken();
            runInAction(() => this.user = user);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    };

    private startRefreshTokenTimer = (user: AuthUser) => {
        const jwtToken = JSON.parse(atob(user.token.split(".")[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    };

    private stopRefreshTokenTimer = () => {
        clearTimeout(this.refreshTokenTimeout);
    };
}