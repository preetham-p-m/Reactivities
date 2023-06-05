import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../@types/ServerError";
import { Token } from "../@types/User";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = localStorage.getItem(Token.JWT);
  appLoaded = false;

  constructor() {
    makeAutoObservable(this);

    reaction(() => this.token, token => {
      if (token) {
        localStorage.setItem(Token.JWT, token);
      } else {
        localStorage.removeItem(Token.JWT);
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