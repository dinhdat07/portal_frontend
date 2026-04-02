import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">{eyebrow}</p> : null}
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="max-w-2xl text-sm text-slate-600">{description}</p>
        </div>
      </div>
      {actions}
    </div>
  );
}
