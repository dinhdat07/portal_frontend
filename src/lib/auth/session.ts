import type { AuthSession } from './types';

const STORAGE_KEY = 'portal_frontend.session';
const UNAUTHORIZED_EVENT = 'portal_frontend.unauthorized';

export function readStoredSession(): AuthSession | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      clearStoredSession();
      return null;
    }
    return parsed;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function writeStoredSession(session: AuthSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function dispatchUnauthorizedEvent() {
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}

export function onUnauthorized(handler: () => void) {
  window.addEventListener(UNAUTHORIZED_EVENT, handler);
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler);
}
