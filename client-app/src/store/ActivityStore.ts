import { makeAutoObservable } from "mobx";
import { Activity } from "../@types/activity";

export default class ActivityStore {
    activities: Activity[] = [];

    constructor() {
        makeAutoObservable(this)
    }
}