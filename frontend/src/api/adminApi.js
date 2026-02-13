import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const adminApi = axios.create({
 baseURL: `${API_URL}/api/admin`

});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;
