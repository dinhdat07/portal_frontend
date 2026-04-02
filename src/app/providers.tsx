import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { queryClient } from './query-client';
import { onUnauthorized } from '../lib/auth/session';
import { useAuthStore } from '../lib/auth/store';

function SessionBridge() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    hydrate();
    return onUnauthorized(clearSession);
  }, [clearSession, hydrate]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionBridge />
      {children}
    </QueryClientProvider>
  );
}
