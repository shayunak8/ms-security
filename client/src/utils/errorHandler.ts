export interface ApiError {
  readonly message: string;
  readonly statusCode?: number;
  readonly isNetworkError: boolean;
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError") ||
      error.message.includes("network")
    ) {
      return {
        message: "Network error. Please check your connection.",
        isNetworkError: true,
      };
    }

    const statusMatch = error.message.match(/^(\d{3})/);
    const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : undefined;

    if (statusCode === 404) {
      return {
        message: "Session not found. Please start a new game.",
        statusCode,
        isNetworkError: false,
      };
    }

    if (statusCode === 400) {
      const message = error.message.replace(/^\d{3}\s+\w+:\s*/, "");
      return {
        message: message || "Invalid request. Please try again.",
        statusCode,
        isNetworkError: false,
      };
    }

    if (statusCode === 500) {
      return {
        message: "Server error. Please try again later.",
        statusCode,
        isNetworkError: false,
      };
    }

    return {
      message: error.message || "An unexpected error occurred.",
      statusCode,
      isNetworkError: false,
    };
  }

  return {
    message: "An unexpected error occurred.",
    isNetworkError: false,
  };
}
