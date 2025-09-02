import axios from "axios";
import { logout, refresh } from "../store/features/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
});

let reduxStore;

export const injectRedux = (store) => {
  reduxStore = store;
};

axiosInstance.interceptors.request.use(async (config) => {
  try {
    let token = sessionStorage.getItem("$INVACCESS");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await reduxStore.dispatch(refresh());
        const accessToken = sessionStorage.getItem("$INVACCESS");
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        reduxStore.dispatch(logout());
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
