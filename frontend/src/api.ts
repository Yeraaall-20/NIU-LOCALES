import axios from "axios";

// Nueva instancia con URL corregida - Puerto 4000 con /api
const apiInstance = axios.create({ 
  baseURL: "http://localhost:4000/api",
  timeout: 10000
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  console.log('🌐 Request URL:', (config.baseURL || '') + (config.url || ''));
  return config;
});

export const api = apiInstance;