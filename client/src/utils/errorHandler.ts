export interface ApiError {
  readonly message: string;
  readonly statusCode?: number;
  readonly isNetworkError: boolean;
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    // Check if it's a network error
    if (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('network')
    ) {
      return {
        message: 'Unable to connect to the server. Please check your connection.',
        isNetworkError: true,
      };
    }

    // Check for common HTTP error patterns
    const statusMatch = error.message.match(/^(\d{3})/);
    const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : undefined;

    // Map common status codes to user-friendly messages
    if (statusCode === 404) {
      return {
        message: 'Session not found. Please start a new game.',
        statusCode,
        isNetworkError: false,
      };
    }

    if (statusCode === 400) {
      // Try to extract the actual error message from the response
      const message = error.message.replace(/^\d{3}\s+\w+:\s*/, '');
      return {
        message: message || 'Invalid request. Please try again.',
        statusCode,
        isNetworkError: false,
      };
    }

    if (statusCode === 500) {
      return {
        message: 'Server error. Please try again later.',
        statusCode,
        isNetworkError: false,
      };
    }

    return {
      message: error.message || 'An unexpected error occurred.',
      statusCode,
      isNetworkError: false,
    };
  }

  return {
    message: 'An unexpected error occurred.',
    isNetworkError: false,
  };
}
