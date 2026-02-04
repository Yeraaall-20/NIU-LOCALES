import axios from "axios";

// Obtener la URL de la API del entorno o usar localhost por defecto
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : "http://localhost:5000/api";

const apiInstance = axios.create({ 
  baseURL: API_URL,
  timeout: 10000
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  console.log('🌐 Request URL:', (config.baseURL || '') + (config.url || ''));
  return config;
});

export const api = apiInstance;