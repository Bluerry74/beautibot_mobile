import { useAuthStore } from "@/store/auth";
import axios from "axios";

const http = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

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
    (res) => res,
    async (error) => {
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

export default http;
