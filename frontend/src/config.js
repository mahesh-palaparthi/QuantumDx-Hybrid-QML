// QuantumDx Cloud & Local API Configuration
const envBase = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL =
  envBase !== undefined && envBase !== ""
    ? envBase
    : import.meta.env.DEV
    ? "http://localhost:5000"
    : "";

export const STREAMLIT_URL = (() => {
  if (import.meta.env.VITE_STREAMLIT_URL) {
    return import.meta.env.VITE_STREAMLIT_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("onrender.com") || (host !== "localhost" && host !== "127.0.0.1")) {
      return "https://quantumdx-dashboard.onrender.com";
    }
  }
  return "http://localhost:8501";
})();
