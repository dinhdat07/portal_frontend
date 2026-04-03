import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearStoredSession, readStoredSession, writeStoredSession } from './session';

describe('session storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it('reads a valid session', () => {
    writeStoredSession({
      expiresAt: '2099-01-01T00:00:00.000Z',
      user: {
        id: '1',
        email: 'ada@example.com',
        username: 'ada',
        firstName: 'Ada',
        lastName: 'Lovelace',
        role: 'admin',
        status: 'active',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    });

    expect(readStoredSession()?.user.username).toBe('ada');
  });

  it('clears expired sessions', () => {
    writeStoredSession({
      expiresAt: '2000-01-01T00:00:00.000Z',
      user: {
        id: '1',
        email: 'ada@example.com',
        username: 'ada',
        firstName: 'Ada',
        lastName: 'Lovelace',
        role: 'user',
        status: 'active',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    });

    expect(readStoredSession()).toBeNull();
    clearStoredSession();
  });
});
