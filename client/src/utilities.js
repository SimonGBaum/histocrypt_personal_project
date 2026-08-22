import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1/",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === "users/refresh/") {
      return Promise.reject(error);
    }
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    if (originalRequest.alreadyRetried) {
      return Promise.reject(error);
    }

    originalRequest.alreadyRetried = true;

    try {
      await api.post("users/refresh/");
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;
