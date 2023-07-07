import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { router } from '../Routes';
import { store } from '../store/Store';
import { routerPath } from '../utils/router/routerPath';
import { Environment } from '../Environment';
import { PaginatedResult } from '../@types/Pagination';

axios.defaults.baseURL = Environment.serviceApiUrl;

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
});

axios.interceptors.response.use(async response => {
    await sleep(1000);
    const pagination = response.headers["pagination"];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            console.log(data);
            if (config.method === "get" && data.errors.hasOwnProperty("id")) {
                router.navigate(`/${routerPath.NOT_FOUND}`);
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
            router.navigate(`/${routerPath.NOT_FOUND}`);
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate(`/${routerPath.SERVER_ERROR}`);
            break;
    }
    return Promise.reject(error);
});

export const ApiService = {
    get: async <T>(url: string, params?: URLSearchParams) => {
        const respose = await axios.get<T>(url, { params });
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
};