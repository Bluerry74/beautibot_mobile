import { useAuthStore } from "@/store/auth";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const http = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
export default http;

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

http.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = useAuthStore.getState().refreshToken;
            if (!refreshToken) {
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const res = await axios.post(
                        `${http.defaults.baseURL}/user/refresh-token`,
                        { refreshToken }
                    );
                    const newToken = res.data.accessToken;
                    useAuthStore.getState().setTokens({
                        accessToken: newToken,
                        refreshToken: res.data.refreshToken || refreshToken,
                        role: useAuthStore.getState().role || "",
                    });
                    http.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return http(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    useAuthStore.getState().logout();
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            } else {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers["Authorization"] = "Bearer " + token;
                            resolve(http(originalRequest));
                        },
                        reject: (err: any) => {
                            reject(err);
                        }
                    });
                });
            }
        }
        return Promise.reject(error);
    }
);


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
