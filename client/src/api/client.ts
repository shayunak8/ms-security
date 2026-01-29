import type {
  CashoutResponse,
  RollResponse,
  SessionResponse,
} from '../types/api';

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

async function request<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      ...init,
    });
  } catch (error) {
    // Network error (fetch failed)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('NetworkError: Failed to fetch');
    }
    throw error;
  }

  if (!response.ok) {
    let errorMessage = `${response.status} ${response.statusText}`;

    try {
      const data = (await response.json()) as {
        message?: string | string[];
        statusCode?: number;
      };

      if (data.message) {
        const messageArray = Array.isArray(data.message)
          ? data.message
          : [data.message];
        errorMessage = messageArray.join(', ');
      }
    } catch {
      // If JSON parsing fails, use the status text
    }

    const error = new Error(errorMessage);
    (error as Error & { statusCode?: number }).statusCode = response.status;
    throw error;
  }

  return (await response.json()) as TResponse;
}

export async function createSession(): Promise<SessionResponse> {
  return request<SessionResponse>('/session', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function roll(sessionId: string): Promise<RollResponse> {
  return request<RollResponse>('/roll', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

export async function cashout(sessionId: string): Promise<CashoutResponse> {
  return request<CashoutResponse>('/cashout', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

