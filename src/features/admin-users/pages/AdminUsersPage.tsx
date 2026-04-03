import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { LoadingState } from '../../../components/ui/LoadingState';
import { PageHeader } from '../../../components/ui/PageHeader';
import { config } from '../../../lib/config';
import { getErrorMessage } from '../../../lib/api/errors';
import { getAdminUsers, type UserFilters } from '../../../lib/api/admin-users';
import { queryKeys } from '../../../lib/api/keys';
import { AdminUsersFilters, type AdminUsersFilterValues } from '../components/AdminUsersFilters';
import { AdminUsersTable } from '../components/AdminUsersTable';

function parseFilters(searchParams: URLSearchParams): UserFilters {
  return {
    page: Number(searchParams.get('page') || '1'),
    pageSize: Number(searchParams.get('page_size') || '20'),
    username: searchParams.get('username') || undefined,
    email: searchParams.get('email') || undefined,
    fullName: searchParams.get('full_name') || undefined,
    role: (searchParams.get('role') as UserFilters['role']) || '',
    status: (searchParams.get('status') as UserFilters['status']) || '',
    includeDeleted: searchParams.get('include_deleted') === 'true',
  };
}

function toFormValues(filters: UserFilters): AdminUsersFilterValues {
  return {
    username: filters.username || '',
    email: filters.email || '',
    fullName: filters.fullName || '',
    role: filters.role || '',
    status: filters.status || '',
    includeDeleted: Boolean(filters.includeDeleted),
  };
}

export function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const queryString = searchParams.toString();

  const query = useQuery({
    queryKey: queryKeys.adminUsers(queryString),
    queryFn: () => getAdminUsers(filters),
  });

  useEffect(() => {
    document.title = 'Admin Users | Portal Frontend';
  }, []);

  const currentPage = filters.page;
  const totalPages = query.data ? Math.max(1, Math.ceil(query.data.meta.total / query.data.meta.pageSize)) : 1;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="User operations"
        description="Search users, review accounts, and manage access."
        actions={
          config.featureFlags.enableAdminCreateUser ? (
            <Link to="/admin/users/new">
              <Button>Create user</Button>
            </Link>
          ) : null
        }
      />

      <AdminUsersFilters
        initialValues={toFormValues(filters)}
        onSubmit={(values) => {
          const next = new URLSearchParams();
          next.set('page', '1');
          next.set('page_size', String(filters.pageSize || 20));
          if (values.username) next.set('username', values.username);
          if (values.email) next.set('email', values.email);
          if (values.fullName) next.set('full_name', values.fullName);
          if (values.role) next.set('role', values.role);
          if (values.status) next.set('status', values.status);
          if (values.includeDeleted) next.set('include_deleted', 'true');
          setSearchParams(next);
        }}
        onReset={() => setSearchParams({ page: '1', page_size: '20' })}
      />

      {query.isLoading ? <LoadingState label="Loading users..." /> : null}
      {query.isError ? <Alert tone="danger" description={getErrorMessage(query.error, 'Unable to load users')} /> : null}
      {query.data ? <AdminUsersTable users={query.data.data} /> : null}

      {query.data ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>
            Page {query.data.meta.page} of {totalPages} - {query.data.meta.total} total users
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              disabled={currentPage <= 1}
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set('page', String(currentPage - 1));
                setSearchParams(next);
              }}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={currentPage >= totalPages}
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set('page', String(currentPage + 1));
                setSearchParams(next);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

