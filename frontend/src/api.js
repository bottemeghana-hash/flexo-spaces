
const configuredApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = (
  configuredApiUrl || "http://127.0.0.1:5000"
).replace(/\/+$/, "");
