import { createContext, useContext } from "react";
import ActivityStore from "./ActivityStore";
import CommonStore from "./CommonStore";
import AuthStore from "./AuthStore";
import MadalStore from "./ModalStore";
import { UserProfileStore } from "./UserProfileStore";
import CommentStore from "./CommentStore";

interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
    authStore: AuthStore;
    modalStore: MadalStore;
    userProfileStore: UserProfileStore;
    commentStore: CommentStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    authStore: new AuthStore(),
    modalStore: new MadalStore(),
    userProfileStore: new UserProfileStore(),
    commentStore: new CommentStore()
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}