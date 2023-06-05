import { makeAutoObservable, runInAction } from "mobx";
import { LoginUser, RegisterUser, User } from "../@types/User";
import { AccountService } from "../services/AccountService";
import { store } from "./Store";
import { router } from "../Routes";
import { RouterPath } from "../@types/RouterPath";

export default class UserStore {
    user: User | null = null;

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
            runInAction(() => this.user = user);
            router.navigate(`/${RouterPath.ACTIVITIES}`);
            store.modalStore.closeModal();
        } catch (error) {
            throw (error);
        }
    };

    login = async (creds: LoginUser) => {
        try {
            const user = await AccountService.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate(`/${RouterPath.ACTIVITIES}`)
            store.modalStore.closeModal();
        } catch (error) {
            throw (error);
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate("/");
    }

    getUser = async () => {
        try {
            const user = await AccountService.current();
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    }
}