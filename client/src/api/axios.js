import axios from "axios";

const envUrl = import.meta.env.VITE_API_URL || "https://taskflow-backend-6mg7.onrender.com/api";
const finalBaseURL = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;

const API = axios.create({
  baseURL: finalBaseURL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;