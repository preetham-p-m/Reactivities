import axios from "axios";
import { Photo } from "../@types/Profile";
import { ApiService } from "./ApiService";

export const PhotosService = {
    uploadPhoto:
        (file: Blob) => {
            let formData = new FormData();
            formData.append('File', file);

            return axios.post<Photo>("Photos", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        },
    setMainPhoto: (id: string) => ApiService.post(`Photos/${id}/set-main`, {}),
    deletePhoto: (id: string) => ApiService.delete(`Photos/${id}`),
}