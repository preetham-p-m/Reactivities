import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../@types/ServerError";
import { auth } from "../utils/constants/auth";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = localStorage.getItem(auth.JWT_TOKEN);
  appLoaded = false;

  constructor() {
    makeAutoObservable(this);

    reaction(() => this.token, token => {
      if (token) {
        localStorage.setItem(auth.JWT_TOKEN, token);
      } else {
        localStorage.removeItem(auth.JWT_TOKEN);
      }
    })
  }

  setServerError(error: ServerError) {
    this.error = error
  }

  setToken = (token: string | null) => {
    this.token = token;
  }

  setAppLoaded = () => {
    this.appLoaded = true;
  }
}