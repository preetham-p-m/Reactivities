import { Activity, ActivityFormValues } from "../@types/Activity";
import { request } from "./ApiService";

const activityEndPoint = "/activities";

export const ActivitiesService = {
    getList: () => request.get<Activity[]>(activityEndPoint),
    getDetails: (id: string) => request.get<Activity>(`${activityEndPoint}/${id}`),
    create: (activity: ActivityFormValues) => request.post<void>(`${activityEndPoint}`, activity),
    update: (activity: ActivityFormValues) => request.put<void>(`${activityEndPoint}/${activity.id}`, activity),
    delete: (id: string) => request.delete<void>(`${activityEndPoint}/${id}`),
    attend: (id: string) => request.post<void>(`${activityEndPoint}/${id}/attend`, {})
}