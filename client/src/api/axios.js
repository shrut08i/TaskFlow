import axios from "axios";

const envUrl = import.meta.env.VITE_API_URL || "https://taskflow-backend-6mg7.onrender.com/api";
const finalBaseURL = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;

const API = axios.create({
  baseURL: finalBaseURL,
});

export default API;