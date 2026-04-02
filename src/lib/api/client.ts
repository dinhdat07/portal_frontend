import { config } from '../config';
import { clearStoredSession, dispatchUnauthorizedEvent, readStoredSession } from '../auth/session';
import { ApiError, type ApiErrorPayload } from './types';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const session = readStoredSession();

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth !== false && session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearStoredSession();
    dispatchUnauthorizedEvent();
  }

  if (!response.ok) {
    let payload: ApiErrorPayload | null = null;
    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      payload = null;
    }

    throw new ApiError(response.status, payload?.error || payload?.message || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
