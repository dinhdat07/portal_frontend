import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/auth/store';

export function RequireAuth({ children }: { children: ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);
  const session = useAuthStore((state) => state.session);
  const location = useLocation();

  if (!hydrated) {
    return <div className="p-8 text-sm text-slate-600">Loading session...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const session = useAuthStore((state) => state.session);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (session.user.role !== 'admin') {
    return <Navigate to="/account/profile" replace />;
  }

  return <>{children}</>;
}

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);
  const session = useAuthStore((state) => state.session);

  if (!hydrated) {
    return <div className="p-8 text-sm text-slate-600">Loading session...</div>;
  }

  if (session) {
    return <Navigate to="/account/profile" replace />;
  }

  return <>{children}</>;
}
