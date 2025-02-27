import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

console.log("VITE_API_URL Loaded:", import.meta.env.VITE_API_URL);
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default API;
