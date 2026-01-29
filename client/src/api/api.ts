import axios, { type AxiosError } from "axios";
import type {
  CashoutResponse,
  RollResponse,
  SessionResponse,
} from "../types/api";
import {
  DEFAULT_API_BASE_URL,
  API_BASE_URL_ENV_VAR,
  HEADERS,
} from "../constants";

const API_BASE_URL =
  import.meta.env[API_BASE_URL_ENV_VAR] ?? DEFAULT_API_BASE_URL;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    [HEADERS.CONTENT_TYPE]: HEADERS.CONTENT_TYPE_JSON,
  },
  responseType: "json",
});

function normalizeAxiosError(err: unknown): Error {
  if (err && typeof err === "object") {
    const axiosErr = err as AxiosError;
    if (axiosErr.isAxiosError) {
      if (!axiosErr.response) {
        // Network or CORS error
        return new Error("NetworkError: Failed to fetch");
      }

      const status = axiosErr.response.status;
      let message = `${status} ${axiosErr.response.statusText}`;

      try {
        const data = axiosErr.response.data as {
          message?: string | string[];
        } | null;
        if (data && data.message) {
          message = Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message;
        }
      } catch {
        // ignore parse errors
      }

      const error = new Error(message);
      (error as Error & { statusCode?: number }).statusCode = status;
      return error;
    }
  }

  return err instanceof Error ? err : new Error(String(err));
}

export async function createSession(): Promise<SessionResponse> {
  try {
    const { data } = await client.post<SessionResponse>("/session", {});
    return data;
  } catch (e) {
    throw normalizeAxiosError(e);
  }
}

export async function roll(sessionId: string): Promise<RollResponse> {
  try {
    const { data } = await client.post<RollResponse>("/roll", { sessionId });
    return data;
  } catch (e) {
    throw normalizeAxiosError(e);
  }
}

export async function cashout(sessionId: string): Promise<CashoutResponse> {
  try {
    const { data } = await client.post<CashoutResponse>("/cashout", {
      sessionId,
    });
    return data;
  } catch (e) {
    throw normalizeAxiosError(e);
  }
}
