import axios from "axios";
import { getStoredToken } from "@/auth/tokenStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  // Intentionally a runtime error for faster MVP debugging.
  // eslint-disable-next-line no-console
  console.warn("Missing VITE_API_BASE_URL. Set it in your environment.");
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

