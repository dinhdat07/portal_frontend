import { create } from 'zustand';
import { clearStoredSession, readStoredSession, writeStoredSession } from './session';
import type { AuthSession } from './types';

interface AuthState {
  session: AuthSession | null;
  hydrated: boolean;
  hydrate: () => void;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  hydrated: false,
  hydrate: () => {
    set({
      session: readStoredSession(),
      hydrated: true,
    });
  },
  setSession: (session) => {
    writeStoredSession(session);
    set({ session });
  },
  clearSession: () => {
    clearStoredSession();
    set({ session: null });
  },
}));
