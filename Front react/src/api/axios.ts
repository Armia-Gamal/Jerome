import axios from "axios";
import { clearAuthStorage, getToken } from "../utils/storage";
import { API_BASE_URL, normalizeApiMediaPaths } from "../utils/media";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => {
    response.data = normalizeApiMediaPaths(response.data);
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      clearAuthStorage();
      if (window.location.pathname !== "/login") {
        window.history.pushState({}, "", "/login");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    }

    return Promise.reject(error);
  },
);

export default api;
