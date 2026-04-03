import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { queryClient } from '../../../app/query-client';
import { Card } from '../../../components/ui/Card';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { EmptyState } from '../../../components/ui/EmptyState';
import { restoreAdminUser } from '../../../lib/api/admin-users';
import { RoleBadge, StatusBadge } from '../../../components/ui/Badge';
import { useAuthStore } from '../../../lib/auth/store';
import { formatDateTime } from '../../../lib/date';
import type { UserSummary } from '../../../lib/auth/types';

interface AdminUsersTableProps {
  users: UserSummary[];
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const currentUserId = useAuthStore((state) => state.session?.user.id);
  const [restoreTarget, setRestoreTarget] = useState<{ id: string; name: string } | null>(null);

  const restoreMutation = useMutation({
    mutationFn: restoreAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setRestoreTarget(null);
    },
  });

  if (users.length === 0) {
    return (
      <EmptyState
        title="No users matched the current filters"
        description="Try relaxing the filters or clearing the deleted-user constraint."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <th className="px-6 py-4">Identity</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Updated</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <p className="text-xs text-slate-500">@{user.username}</p>
                </td>
                <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                <td className="px-6 py-4 text-sm text-slate-600">{formatDateTime(user.updatedAt)}</td>
                <td className="px-6 py-4">
                  {user.status === 'deleted' ? (
                    <button
                      type="button"
                      className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-500 disabled:cursor-not-allowed disabled:text-slate-400"
                      disabled={restoreMutation.isPending}
                      onClick={() => setRestoreTarget({ id: user.id, name: `${user.firstName} ${user.lastName}` })}
                    >
                      {restoreMutation.isPending ? 'Restoring...' : 'Restore'}
                    </button>
                  ) : null}
                  {user.role === 'admin' && user.id === currentUserId ? (
                    <span className="text-sm font-semibold text-slate-400">Current admin</span>
                  ) : user.status !== 'deleted' ? (
                    <Link className="text-sm font-semibold text-cobalt-600 hover:text-cobalt-500" to={`/admin/users/${user.id}`}>
                      View details
                    </Link>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 md:hidden">
        {users.map((user) => (
          <div key={user.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>
              <RoleBadge role={user.role} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <StatusBadge status={user.status} />
              {user.status === 'deleted' ? (
                <button
                  type="button"
                  className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-500 disabled:cursor-not-allowed disabled:text-slate-400"
                  disabled={restoreMutation.isPending}
                  onClick={() => setRestoreTarget({ id: user.id, name: `${user.firstName} ${user.lastName}` })}
                >
                  {restoreMutation.isPending ? 'Restoring...' : 'Restore'}
                </button>
              ) : null}
              {user.role === 'admin' && user.id === currentUserId ? (
                <span className="text-sm font-semibold text-slate-400">Current admin</span>
              ) : user.status !== 'deleted' ? (
                <Link className="text-sm font-semibold text-cobalt-600 hover:text-cobalt-500" to={`/admin/users/${user.id}`}>
                  Open
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(restoreTarget)}
        title="Restore this user?"
        description={
          restoreTarget
            ? `${restoreTarget.name} will regain access and return to active status.`
            : 'This user will regain access and return to active status.'
        }
        confirmLabel="Restore user"
        tone="primary"
        busy={restoreMutation.isPending}
        onCancel={() => setRestoreTarget(null)}
        onConfirm={() => {
          if (restoreTarget) {
            restoreMutation.mutate(restoreTarget.id);
          }
        }}
      />
    </Card>
  );
}
