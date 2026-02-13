import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Attach User or Admin Token Automatically
api.interceptors.request.use(
  (config) => {
    // Check both tokens
    const userToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    // Admin token priority (for admin routes)
    const tokenToUse = adminToken || userToken;

    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Optional: Auto Logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized - Token invalid or expired");
    }
    return Promise.reject(error);
  }
);

export default api;
