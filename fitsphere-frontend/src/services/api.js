import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach JWT + log every outgoing request ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(`[API] No token found for ${config.method?.toUpperCase()} ${config.url}`);
    }

    // Debug log — remove in production
    console.debug(
      `[API →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      config.data ? JSON.parse(JSON.stringify(config.data)) : ""
    );

    return config;
  },
  (error) => {
    console.error("[API] Request setup error:", error);
    return Promise.reject(error);
  }
);

// ── Response interceptor: log results, handle auth errors globally ──
api.interceptors.response.use(
  (response) => {
    console.debug(
      `[API ←] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`
    );
    return response;
  },
  (error) => {
    const status  = error?.response?.status;
    const url     = error?.config?.url || "";
    const method  = error?.config?.method?.toUpperCase() || "";
    const payload = error?.config?.data;
    const body    = error?.response?.data;

    console.error(
      `[API ✗] ${status} ${method} ${url}`,
      "\n  Request body:", payload ? JSON.parse(payload) : "(none)",
      "\n  Response body:", body
    );

    if (status === 401) {
      console.warn("[API] 401 — token expired or invalid. Redirecting to login.");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      // Small delay so the error can be logged before redirect
      setTimeout(() => { window.location.href = "/login"; }, 100);
    }

    return Promise.reject(error);
  }
);

export default api;
