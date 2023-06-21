import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../@types/ChatComment";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { store } from "./Store";
import { Environment } from "../Environment";
import { signalRConst } from "../utils/constants/signalRConst";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(`${Environment.serviceChatUrl}?${signalRConst.ACTIVITY_ID}=${activityId}`,
                    {
                        accessTokenFactory: () => store.authStore.user?.token!
                    })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start().catch(error => console.log("Error establishing thr connection"));
            this.hubConnection.on(signalRConst.LOAD_COMMENTS, (comments: ChatComment[]) => {
                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + "Z");
                    });
                    this.comments = comments;
                });
            });

            this.hubConnection.on(signalRConst.RECEIVE_COMMENT, (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.unshift(comment);
                });
            });
        }
    };

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log("Error stoping connection: ", error));
    };

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    };

    addCommnet = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;

        try {
            this.hubConnection?.invoke(signalRConst.SEND_COMMENT, values);
        } catch (error) {
            console.log(error);
        }
    };

}