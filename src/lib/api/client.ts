import { config } from '../config';
import { readCookie } from '../auth/csrf';
import { clearStoredSession, dispatchUnauthorizedEvent } from '../auth/session';
import { ApiError, type ApiErrorPayload } from './types';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const method = (options.method || 'GET').toUpperCase();

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const unsafeMethod = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  if (unsafeMethod && !headers.has(config.csrfHeaderName)) {
    const csrfToken = readCookie(config.csrfCookieName);
    if (csrfToken) {
      headers.set(config.csrfHeaderName, csrfToken);
    }
  }

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    method,
    headers,
    credentials: 'include',
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
