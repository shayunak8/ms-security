export const DEFAULT_API_BASE_URL = "http://localhost:3000";

export const API_BASE_URL_ENV_VAR = "VITE_API_BASE_URL";

export const HTTP_STATUS = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
  OK: 200,
  CREATED: 201,
} as const;

export const API_ERROR_MESSAGE = {
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your connection.",
  SESSION_NOT_FOUND: "Session not found. Please start a new game.",
  INVALID_REQUEST: "Invalid request. Please try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNEXPECTED_ERROR: "An unexpected error occurred.",
  FETCH_FAILED: "Failed to fetch",
} as const;
export const HEADERS = {
  CONTENT_TYPE: "Content-Type",
  CONTENT_TYPE_JSON: "application/json",
} as const;
