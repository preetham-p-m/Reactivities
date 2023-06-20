import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../@types/Activity";
import { ActivitiesService } from "../Services/ActivityService";
import { DateFormat } from "../@types/CommonUtils";
import { format } from "date-fns";
import { Profile } from "../@types/Profile";
import { store } from "./Store";

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
            }, {} as { [key: string]: Activity[]; })
        );
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await ActivitiesService.getList();
            activities.forEach((activity: Activity) => {
                this.setActivity(activity);
                this.activityRegistry.set(activity.id, activity);
                this.setLoadingInitial(false);
            });
        } catch (error) {
            this.setLoadingInitial(false);
        }
    };

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
    };

    private setActivity = (activity: Activity) => {
        const user = store.authStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(a => a.userName === user.userName);
            activity.isHost = activity.hostUserName === user.userName;
            activity.host = activity.attendees!.find(a => a.userName === activity.hostUserName);
        }
        activity.date = new Date(activity.date);
        this.activityRegistry.set(activity.id, activity);
    };

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.authStore.user;
        const attendee = new Profile(user!);
        try {
            await ActivitiesService.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUserName = user!.userName;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            });
        } catch (error) {
            console.log(error);
        }
    };

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await ActivitiesService.update(activity);
            runInAction(() => {
                if (activity.id) {
                    let updateActivity = { ...this.getActivity(activity.id), ...activity };
                    this.activityRegistry.set(activity.id, updateActivity as Activity);
                    this.selectedActivity = updateActivity as Activity;
                }
            });
        } catch (error) {
        }
    };

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await ActivitiesService.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    updateAttendence = async () => {
        const user = store.authStore.user;
        this.loading = true;
        try {
            await ActivitiesService.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.userName !== user?.userName);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await ActivitiesService.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    };
}