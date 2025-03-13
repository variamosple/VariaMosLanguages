import axios, { AxiosRequestConfig } from "axios";
import { AppConfig } from "./AppConfig";

const authInterceptor = (config: AxiosRequestConfig) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const ADMIN_CLIENT = axios.create({
  baseURL: AppConfig.ADMIN_API_URL,
  timeout: 30000,
  withCredentials: true,
});

ADMIN_CLIENT.interceptors.request.use(authInterceptor);

export const LANGUAGES_CLIENT = axios.create({
  baseURL: AppConfig.LANGUAGES_API_URL,
  timeout: 30000,
  withCredentials: true,
});

LANGUAGES_CLIENT.interceptors.request.use(authInterceptor);
