import axios from "axios";
import { getStoredToken } from "@/auth/tokenStorage";

// If VITE_API_BASE_URL is unset, we intentionally fall back to relative URLs.
// In dev, Vite can proxy /api to the backend to avoid CORS headaches.
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "";

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn("VITE_API_BASE_URL is not set. Using relative /api/* URLs (dev proxy recommended).");
}

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

