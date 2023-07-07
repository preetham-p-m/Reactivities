import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../@types/Activity";
import { ActivitiesService } from "../Services/ActivityService";
import { DateFormat } from "../@types/CommonUtils";
import { format } from "date-fns";
import { User } from "../@types/User";
import { store } from "./Store";
import { Pagination, PagingParams } from "../@types/Pagination";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set("all", true);

    constructor() {
        makeAutoObservable(this);
        reaction(() => this.predicate.keys(), () => {
            this.pagingParams = new PagingParams();
            this.activityRegistry.clear();
            this.loadActivities();
        });
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

    get axiosParams() {
        const params = new URLSearchParams();
        params.append("pageNumber", this.pagingParams.pageNumber.toString());
        params.append("pageSize", this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === "startDate") {
                params.append(key, (value as Date).toISOString());
            } else {
                params.append(key, value);
            }
        });
        return params;
    }

    private resetPredicate = () => {
        this.predicate.forEach((value, key) => {
            if (key !== "startDate") this.predicate.delete(key);
        });
    };

    setPredicate = (key: string, value: string | Date) => {
        switch (key) {
            case "all":
                this.resetPredicate();
                this.predicate.set("all", true);
                break;
            case "isGoing":
                this.resetPredicate();
                this.predicate.set("isGoing", true);
                break;
            case "isHost":
                this.resetPredicate();
                this.predicate.set("isHost", true);
                break;
            case "startDate":
                this.predicate.delete("startDate");
                this.predicate.set("startDate", value);
                break;
        }
    };

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    };

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const result = await ActivitiesService.getList(this.axiosParams);
            runInAction(() => {
                result.data.forEach((activity: Activity) => {
                    this.setActivity(activity);
                    this.activityRegistry.set(activity.id, activity);
                });
                this.setPagination(result.pagination);
                this.setLoadingInitial(false);
            });
        } catch (error) {
            runInAction(() => {
                this.setLoadingInitial(false);
            });
        }
    };

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
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
        const attendee = new User(user!);
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
                    const attendee = new User(user!);
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

    updateAttendeeFollowing = (userName: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.userName === userName) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            });
        });
    };
}