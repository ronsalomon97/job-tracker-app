import axios from "axios";
// Ensure no double "/api/api" issue & provide fallback for local development
const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/$/, "");

const API = axios.create({
  baseURL: baseURL, // ✅ Removes trailing slash to avoid duplicate "/api/api"
});

console.log("VITE_API_URL Loaded:", baseURL);

API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default API;
