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

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    try {
      const data = (await response.json()) as {
        message?: string | string[];
      };

      const messageArray = Array.isArray(data.message)
        ? data.message
        : data.message
          ? [data.message]
          : [];

      const message =
        messageArray.join(', ') || `${response.status} ${response.statusText}`;

      throw new Error(message);
    } catch {
      throw new Error(`${response.status} ${response.statusText}`);
    }
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

