import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || (
  (typeof window !== "undefined" && (
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1" || 
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.startsWith("10.") ||
    window.location.hostname.startsWith("172.")
  ))
    ? `http://${window.location.hostname}:5000`
    : "https://mytailor-n8jn.onrender.com"
);

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

// Response interceptor to handle token refresh and unauthorized access.
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop if the refresh token endpoint itself fails
    if (originalRequest.url && originalRequest.url.includes("/api/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/api/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired. Please login again.", refreshError);
        
        // Clear auth cache if session expires
        localStorage.removeItem("user");
        localStorage.removeItem("tailor");
        localStorage.removeItem("accessToken");

        // Dispatch custom window event to notify AuthContext to update React state
        window.dispatchEvent(new Event("auth-logout"));

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
