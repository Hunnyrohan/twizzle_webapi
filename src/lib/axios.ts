import axios from "axios";

const api = axios.create({
  baseURL: typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000/api`
    : "http://localhost:5000/api",
  withCredentials: true, // REQUIRED for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
