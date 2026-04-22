import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { clearAuthStorage, getToken } from "../utils/auth";
import { showErrorToast, showWarningToast } from "../utils/toast";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearAuthStorage();

      if (!window.location.pathname.includes("/login")) {
        showWarningToast("Session expired. Please login again.");
        window.location.href = "/login";
      }

      error.__handled = true;
    } else if (status === 403) {
      showErrorToast(
        "Access Denied. You are not allowed to perform this action.",
      );
      error.__handled = true;
    } else if (status >= 500) {
      showErrorToast("Server error. Please try again later.");
      error.__handled = true;
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
