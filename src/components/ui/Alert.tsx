import { cn } from '../../lib/utils';

interface AlertProps {
  title?: string;
  description: string;
  tone?: 'info' | 'warning' | 'danger' | 'success';
}

export function Alert({ title, description, tone = 'info' }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-3 text-sm',
        tone === 'info' && 'border-cobalt-200 bg-cobalt-50 text-cobalt-700',
        tone === 'warning' && 'border-amber-200 bg-amber-50 text-amber-700',
        tone === 'danger' && 'border-orange-200 bg-orange-50 text-orange-700',
        tone === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
      )}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <p>{description}</p>
    </div>
  );
}
