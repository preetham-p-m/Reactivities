import axios, { AxiosResponse } from 'axios';

axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = <T>(respose: AxiosResponse<T>) => respose.data;

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
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