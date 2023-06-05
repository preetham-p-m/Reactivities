import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { router } from '../Routes';
import { store } from '../store/Store';
import { RouterPath } from '../@types/RouterPath';

axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = <T>(respose: AxiosResponse<T>) => respose.data;

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            console.log(data)
            if (config.method === "get" && data.errors.hasOwnProperty("id")) {
                router.navigate(`/${RouterPath.NOT_FOUND}`);
            }
            if (data.errors) {
                const modelStateError = [];
                for (const key in data.errors) {
                    if (data.errors[key])
                        modelStateError.push(data.errors[key]);
                }
                throw modelStateError.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error("unauthorized");
            break;
        case 403:
            toast.error("forbidden");
            break;
        case 404:
            router.navigate(`/${RouterPath.NOT_FOUND}`);
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate(`/${RouterPath.SERVER_ERROR}`);
            break;
    }
    return Promise.reject(error);
});

export const request = {
    get: async <T>(url: string) => {
        const respose = await axios.get<T>(url);
        return responseBody(respose);
    },
    post: async <T>(url: string, body: object) => {
        const respose = await axios.post<T>(url, body);
        return responseBody(respose);
    },
    put: async <T>(url: string, body: object) => {
        const respose = await axios.put<T>(url, body);
        return responseBody(respose);
    },
    delete: async <T>(url: string) => {
        const respose = await axios.delete<T>(url);
        return responseBody(respose);
    },
}