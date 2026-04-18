import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid — auto-logout
        // Skip for login/register endpoints (401 there means bad credentials, not expired token)
        const url = error.config?.url || "";
        if (!url.includes("/login") && !url.includes("/register")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
        }
      } else if (error.response.status === 500) {
        console.error("Server error, Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout, Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;