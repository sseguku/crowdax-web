import axios from "axios";
import { config } from "./config";

// Create axios instance with base configuration for Rails API
const api = axios.create({
  baseURL: config.api.baseURL, // Rails API port
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Important for Rails session cookies if needed
});

// Request interceptor to add auth token for Rails API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Rails typically uses "Authorization: Bearer <token>" format
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token if needed for Rails
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle Rails API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle Rails API specific error responses
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (error.response?.status === 422) {
      // Handle Rails validation errors
      console.error("Validation errors:", error.response.data);
    } else if (error.response?.status === 500) {
      // Handle Rails server errors
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
