interface DetailRowProps {
  label: string;
  value: import('react').ReactNode;
}

export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <span className="text-sm text-slate-900">{value}</span>
    </div>
  );
}
