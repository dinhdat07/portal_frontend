import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
}
