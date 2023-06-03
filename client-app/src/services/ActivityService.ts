import { Activity } from "../@types/Activity";
import { request } from "./ApiService";

const activityEndPoint = "/activities";

export const ActivitiesService = {
    getList: () => request.get<Activity[]>(activityEndPoint),
    getDetails: (id: string) => request.get<Activity>(`${activityEndPoint}/${id}`),
    create: (activity: Activity) => request.post(`${activityEndPoint}`, activity),
    update: (activity: Activity) => request.put(`${activityEndPoint}/${activity.id}`, activity),
    delete: (id: string) => request.delete(`${activityEndPoint}/${id}`),
}