import axios from "axios";

const API = axios.create({
  baseURL: "https://taskflow-backend-6mg7.onrender.com",
});

export default API;