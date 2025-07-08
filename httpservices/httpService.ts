import http from "@/httpservices/interceptors";
import { AxiosRequestConfig, AxiosResponse } from "axios";


export const get = async <T = unknown>(
    url: string,
    option: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
    const res: AxiosResponse<T> = await http.get(url, option);
    return res;
};

export const post = async <T = unknown>(
    url: string,
    data: unknown = {},
    option: AxiosRequestConfig = {} 
): Promise<AxiosResponse<T>> => {
    const fullUrl = http.defaults.baseURL
        ? `${http.defaults.baseURL.replace(/\/$/, "")}/${url.replace(
              /^\//,
              ""
          )}`
        : url;

    console.log("POST request to:", fullUrl, "with data:", data);
    try {
        const res: AxiosResponse<T> = await http.post(url, data, option);
        return res;
    } catch (err) {
        console.error("Error in post()", err);
        throw err;
    }
};

export const put = async <T = unknown>(
    url: string,
    data: unknown = {},
    option: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
    const res: AxiosResponse<T> = await http.put(url, data, option);
    return res;
};

export const remove = async <T = unknown>(
    url: string,
    option: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
    const res: AxiosResponse<T> = await http.delete(url, option);
    return res;
};

export const patch = async <T = unknown>(
    url: string,
    data: unknown = {},
    option: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
    const res: AxiosResponse<T> = await http.patch(url, data, option);
    return res;
};
