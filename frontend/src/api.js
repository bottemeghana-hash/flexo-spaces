
// LOCAL DEVELOPMENT AND PRODUCTION API CONFIGURATION

const LOCAL_API_URL = "http://127.0.0.1:5000";

const PRODUCTION_API_URL =
  "https://flexo-spaces-1.onrender.com";

// Automatically select the correct backend
export const API_BASE_URL = import.meta.env.DEV
  ? LOCAL_API_URL
  : PRODUCTION_API_URL;
