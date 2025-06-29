import axios from "axios";
import { UseAuth } from "../component/context/useAuth";

const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = UseAuth.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/user/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${UseAuth.getRefreshToken()}`,
            },
          }
        );

        const newAccessToken = res.data.accessToken;
        UseAuth.setToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return http(originalRequest);
      } catch (err) {
        UseAuth.clear();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default http;
