const apiBaseUrl = (process.env.VUE_APP_API_URL || "http://localhost:8080").replace(/\/$/, "");

const wsBaseUrl = (process.env.VUE_APP_WS_URL || apiBaseUrl.replace(/^http/, "ws")).replace(/\/$/, "");

export const API_BASE_URL = apiBaseUrl;
export const WS_BASE_URL = wsBaseUrl;
