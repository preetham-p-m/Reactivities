import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, User } from "../@types/User";
import { UserProfileService } from "../services/UserProfileService";
import { store } from "./Store";
import { PhotosService } from "../services/PhotosService";
import { FollowService } from "../services/FollowService";

export class UserProfileStore {
    user: User | null = null;
    loadingProfile: boolean = false;
    uploading: boolean = false;
    loading: boolean = false;
    followings: User[] = [];
    loadingFollowings = false;
    activeTab = 0;

    constructor() {
        makeAutoObservable(this);

        reaction(() => this.activeTab, activeTab => {
            if (activeTab === 3 || activeTab === 4) {
                const predicate = activeTab === 3 ? "followers" : "following";
                this.loadFollowings(predicate);
            } else {
                this.followings = [];
            }
        });
    }

    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    };

    get isCurrentUser() {
        if (store.authStore.user && this.user) {
            return this.user.userName === store.authStore.user.userName;
        }
        return false;
    }

    loadProfile = async (userName: string) => {
        this.loadingProfile = true;
        try {
            var profile = await UserProfileService.getProfile(userName);
            runInAction(() => this.user = profile);
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingProfile = false);
        }
    };

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await PhotosService.uploadPhoto(file);
            const photo = response.data;

            runInAction(() => {
                if (this.user) {
                    this.user.photos?.push(photo);
                    if (photo.isMain && store.authStore.user) {
                        store.authStore.setImage(photo.url);
                        this.user.image = photo.url;
                    }
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() =>
                this.uploading = false
            );
        }
    };

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await PhotosService.setMainPhoto(photo.id);
            store.authStore.setImage(photo.url);
            runInAction(() => {
                if (this.user && this.user.photos) {
                    this.user.photos.find(p => p.isMain)!.isMain = false;
                    this.user.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.user.image = photo.url;
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    };

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await PhotosService.deletePhoto(photo.id);
            runInAction(() => {
                if (this.user) {
                    this.user.photos = this.user.photos?.filter(p => p.id !== photo.id);
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    };

    updateFollowing = async (userName: string, following: boolean) => {
        this.loading = true;
        try {
            await FollowService.updateFollowing(userName);
            store.activityStore.updateAttendeeFollowing(userName);

            runInAction(() => {
                if (this.user && this.user?.userName !== store.authStore.user?.userName && this.user.userName === userName) {
                    following ? this.user.followersCount++ : this.user.followersCount--;
                    this.user.following = !this.user.following;
                }
                if (this.user && this.user?.userName === store.authStore.user?.userName) {
                    following ? this.user.followingCount++ : this.user.followingCount--;
                }
                this.followings.forEach((user) => {
                    if (user.userName === userName) {
                        user.following ? user.followersCount-- : user.followersCount++;
                        user.following = !user.following;
                    }
                });
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await FollowService.listFollowing(this.user!.userName, predicate);
            runInAction(() => {
                this.followings = followings;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingFollowings = false;
            });
        }
    };
}