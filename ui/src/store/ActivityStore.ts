import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../@types/Activity";
import { ActivitiesService } from "../services/ActivityService";
import { DateFormat } from "../@types/CommonUtils";
import { format } from "date-fns";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values())
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    get getGroupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date, DateFormat.DATE_ONLY);
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        );
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await ActivitiesService.getList();
            activities.forEach((activity: Activity) => {
                activity.date = new Date(activity.date);
                this.activityRegistry.set(activity.id, activity);
                this.setLoadingInitial(false);
            });
        } catch (error) {
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }

        this.setLoadingInitial(true);
        try {
            activity = await ActivitiesService.getDetails(id);
            this.setActivity(activity);
            runInAction(() => this.selectedActivity = activity);
            this.setLoadingInitial(false);
            return activity;
        } catch (error) {
            this.setLoadingInitial(false);
        }
    }

    private setActivity = (activity: Activity) => {
        activity.date = new Date(activity.date);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await ActivitiesService.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await ActivitiesService.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            this.loading = false;
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await ActivitiesService.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}