import { Button } from './Button';
import { Card } from './Card';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = 'danger',
  onConfirm,
  onCancel,
  busy,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-slate-950">{title}</h2>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} disabled={busy}>
            {busy ? 'Working...' : confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}
