const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

export const API_ORIGIN = new URL(API_BASE_URL).origin;

export default API_BASE_URL;