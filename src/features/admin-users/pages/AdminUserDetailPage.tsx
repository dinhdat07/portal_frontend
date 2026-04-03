import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert } from '../../../components/ui/Alert';
import { RoleBadge, StatusBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { DetailRow } from '../../../components/ui/DetailRow';
import { LoadingState } from '../../../components/ui/LoadingState';
import { PageHeader } from '../../../components/ui/PageHeader';
import { queryClient } from '../../../app/query-client';
import { deleteAdminUser, getAdminUser, restoreAdminUser, updateAdminUserRole } from '../../../lib/api/admin-users';
import { getErrorMessage } from '../../../lib/api/errors';
import { queryKeys } from '../../../lib/api/keys';
import { useAuthStore } from '../../../lib/auth/store';
import { config } from '../../../lib/config';
import { formatDate, formatDateTime } from '../../../lib/date';
import type { UserRole } from '../../../lib/auth/types';

export function AdminUserDetailPage() {
  const { userId = '' } = useParams();
  const navigate = useNavigate();
  const currentUserId = useAuthStore((state) => state.session?.user.id);
  const [role, setRole] = useState<UserRole>('user');
  const [dialog, setDialog] = useState<'delete' | 'restore' | null>(null);

  const query = useQuery({
    queryKey: queryKeys.adminUser(userId),
    queryFn: () => getAdminUser(userId),
    enabled: Boolean(userId),
  });

  const roleMutation = useMutation({
    mutationFn: (nextRole: UserRole) => updateAdminUserRole(userId, nextRole),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.adminUser(userId), data);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAdminUser(userId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.adminUser(userId), data);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDialog(null);
      navigate('/admin/users');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: () => restoreAdminUser(userId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.adminUser(userId), data);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDialog(null);
    },
  });

  useEffect(() => {
    document.title = 'Admin User Detail | Portal Frontend';
  }, []);

  useEffect(() => {
    if (query.data) {
      setRole(query.data.role);
    }
  }, [query.data]);

  const destructiveBusy = deleteMutation.isPending || restoreMutation.isPending;

  if (query.isLoading) {
    return <LoadingState label="Loading user details..." />;
  }

  if (query.isError) {
    return (
      <div className="space-y-4">
        <Alert tone="danger" description={getErrorMessage(query.error, 'Unable to load user details')} />
        <Button variant="secondary" onClick={() => navigate('/admin/users')}>
          Back to users
        </Button>
      </div>
    );
  }

  const user = query.data;
  if (!user) {
    return null;
  }
  const roleChanged = role !== user.role;
  const isOtherAdmin = user.role === 'admin' && user.id !== currentUserId;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title={`${user.firstName} ${user.lastName}`}
        description="Review this account, update access, and manage account status."
        actions={
          <Link to="/admin/users">
            <Button variant="secondary">Back to users</Button>
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Identity snapshot</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-950">{user.email}</h2>
              </div>
              <div className="flex gap-2">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <DetailRow label="Username" value={`@${user.username}`} />
              <DetailRow label="Date of birth" value={formatDate(user.dob)} />
              <DetailRow label="Created" value={formatDateTime(user.createdAt)} />
              <DetailRow label="Updated" value={formatDateTime(user.updatedAt)} />
              <DetailRow label="Deleted at" value={formatDateTime(user.deletedAt)} />
              <DetailRow label="Deleted by" value={user.deletedBy || 'Unavailable'} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-5">
              <h3 className="font-display text-xl font-semibold text-slate-950">Access controls</h3>
              <p className="mt-1 text-sm text-slate-600">Choose the role this user should have in the workspace.</p>
            </div>

            {isOtherAdmin ? (
              <div className="mb-4">
                <Alert tone="warning" description="Other admin accounts are read-only. You cannot change this admin from here." />
              </div>
            ) : null}

            {roleMutation.isError ? (
              <Alert tone="danger" description={getErrorMessage(roleMutation.error, 'Unable to update role')} />
            ) : null}

            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <label className="block flex-1">
                <span className="field-label">Role</span>
                <select
                  className="field-input"
                  value={role}
                  disabled={isOtherAdmin || roleMutation.isPending}
                  onChange={(event) => setRole(event.target.value as UserRole)}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </label>
              <Button disabled={isOtherAdmin || !roleChanged || roleMutation.isPending} onClick={() => roleMutation.mutate(role)}>
                {roleMutation.isPending ? 'Saving...' : 'Save role'}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-display text-xl font-semibold text-slate-950">Lifecycle actions</h3>
            <p className="mt-2 text-sm text-slate-600">
              Deactivate an account when needed, or restore it later.
            </p>

            {(deleteMutation.isError || restoreMutation.isError) ? (
              <div className="mt-4">
                <Alert
                  tone="danger"
                  description={getErrorMessage(deleteMutation.error || restoreMutation.error, 'Unable to update user state')}
                />
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              {user.status === 'deleted' ? (
                <Button className="w-full" disabled={isOtherAdmin || destructiveBusy} onClick={() => setDialog('restore')}>
                  Restore user
                </Button>
              ) : (
                <Button variant="danger" className="w-full" disabled={isOtherAdmin || destructiveBusy} onClick={() => setDialog('delete')}>
                  Delete user
                </Button>
              )}
              {config.featureFlags.enableAdminUserEdit ? (
                isOtherAdmin ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Edit user
                  </Button>
                ) : (
                  <Link to={`/admin/users/${user.id}/edit`} className="block">
                    <Button variant="secondary" className="w-full">
                      Edit user
                    </Button>
                  </Link>
                )
              ) : null}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-xl font-semibold text-slate-950">Admin notes</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Use role changes carefully because they affect access immediately.</li>
              <li>Newly created accounts may stay pending until setup is completed.</li>
              <li>Deleted users can be restored from this page at any time.</li>
              <li>Other admin accounts are read-only for safety.</li>
            </ul>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={dialog === 'delete'}
        title="Delete this user?"
        description="This user will lose access, but you can restore the account later."
        confirmLabel="Delete user"
        busy={deleteMutation.isPending}
        onCancel={() => setDialog(null)}
        onConfirm={() => deleteMutation.mutate()}
      />

      <ConfirmDialog
        open={dialog === 'restore'}
        title="Restore this user?"
        description="This user will regain access and return to active status."
        confirmLabel="Restore user"
        tone="primary"
        busy={restoreMutation.isPending}
        onCancel={() => setDialog(null)}
        onConfirm={() => restoreMutation.mutate()}
      />
    </div>
  );
}
