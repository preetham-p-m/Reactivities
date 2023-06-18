import { Activity, ActivityFormValues } from "../@types/Activity";
import { ApiService } from "./ApiService";

const activityEndPoint = "/activities";

export const ActivitiesService = {
    getList: () => ApiService.get<Activity[]>(activityEndPoint),
    getDetails: (id: string) => ApiService.get<Activity>(`${activityEndPoint}/${id}`),
    create: (activity: ActivityFormValues) => ApiService.post<void>(`${activityEndPoint}`, activity),
    update: (activity: ActivityFormValues) => ApiService.put<void>(`${activityEndPoint}/${activity.id}`, activity),
    delete: (id: string) => ApiService.delete<void>(`${activityEndPoint}/${id}`),
    attend: (id: string) => ApiService.post<void>(`${activityEndPoint}/${id}/attend`, {})
}