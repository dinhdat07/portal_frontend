import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="panel flex flex-col items-start gap-4 p-8">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
        ·
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl font-semibold text-slate-900">{title}</h3>
        <p className="max-w-xl text-sm text-slate-600">{description}</p>
      </div>
      {action}
    </div>
  );
}
