import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../@types/Profile";
import { UserProfileService } from "../Services/UserProfileService";
import { store } from "./Store";
import { PhotosService } from "../Services/PhotosService";

export class UserProfileStore {
    profile: Profile | null = null;
    loadingProfile: boolean = false;
    uploading: boolean = false;
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isCurrentUser() {
        if (store.authStore.user && this.profile) {
            return this.profile.userName === store.authStore.user.userName;
        }
        return false;
    }

    loadProfile = async (userName: string) => {
        this.loadingProfile = true;
        try {
            var profile = await UserProfileService.getProfile(userName);
            runInAction(() => this.profile = profile);
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await PhotosService.uploadPhoto(file);
            const photo = response.data;

            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.authStore.user) {
                        store.authStore.setImage(photo.url);
                        this.profile.image = photo.url;
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
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await PhotosService.setMainPhoto(photo.id);
            store.authStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await PhotosService.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id);
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }
}