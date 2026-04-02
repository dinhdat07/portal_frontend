import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import type { UserRole, UserStatus } from '../../lib/auth/types';

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent';
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        tone === 'neutral' && 'bg-slate-100 text-slate-700',
        tone === 'success' && 'bg-emerald-100 text-emerald-700',
        tone === 'warning' && 'bg-amber-100 text-amber-700',
        tone === 'danger' && 'bg-orange-100 text-orange-700',
        tone === 'accent' && 'bg-cobalt-100 text-cobalt-600',
      )}
    >
      {children}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  return <Badge tone={role === 'admin' ? 'accent' : 'neutral'}>{role}</Badge>;
}

export function StatusBadge({ status }: { status: UserStatus }) {
  const tone =
    status === 'active' ? 'success' : status === 'pending_verification' ? 'warning' : 'danger';
  return <Badge tone={tone}>{status.replace('_', ' ')}</Badge>;
}
