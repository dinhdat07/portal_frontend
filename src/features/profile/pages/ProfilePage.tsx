import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../../components/ui/Alert';
import { Card } from '../../../components/ui/Card';
import { DetailRow } from '../../../components/ui/DetailRow';
import { LoadingState } from '../../../components/ui/LoadingState';
import { PageHeader } from '../../../components/ui/PageHeader';
import { RoleBadge, StatusBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { queryKeys } from '../../../lib/api/keys';
import { getMyProfile } from '../../../lib/api/users';
import { getErrorMessage } from '../../../lib/api/errors';
import { formatDate, formatDateTime } from '../../../lib/date';
import { config } from '../../../lib/config';
import { useAuthStore } from '../../../lib/auth/store';

export function ProfilePage() {
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);

  const query = useQuery({
    queryKey: queryKeys.me,
    queryFn: getMyProfile,
  });

  useEffect(() => {
    document.title = 'Profile | Portal Frontend';
  }, []);

  useEffect(() => {
    if (query.data && session && query.data.updatedAt !== session.user.updatedAt) {
      setSession({
        ...session,
        user: query.data,
      });
    }
  }, [query.data, session, setSession]);

  if (query.isLoading) {
    return <LoadingState label="Loading profile..." />;
  }

  if (query.isError) {
    return <Alert tone="danger" description={getErrorMessage(query.error, 'Unable to load your profile')} />;
  }

  const user = query.data;
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Profile overview"
        description="Review your current account details and jump into editing or password updates."
        actions={
          config.featureFlags.enableProfileEdit ? (
            <Link to="/account/profile/edit">
              <Button>Edit profile</Button>
            </Link>
          ) : (
            <Link to="/account/security">
              <Button>Change password</Button>
            </Link>
          )
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-950">
                {user.firstName} {user.lastName}
              </h2>
              <p className="mt-1 text-sm text-slate-600">@{user.username}</p>
            </div>
            <div className="flex gap-2">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Date of birth" value={formatDate(user.dob)} />
            <DetailRow label="Created" value={formatDateTime(user.createdAt)} />
            <DetailRow label="Updated" value={formatDateTime(user.updatedAt)} />
            <DetailRow label="Email verified" value={formatDateTime(user.emailVerifiedAt)} />
            <DetailRow label="Last login" value={formatDateTime(user.lastLoginAt)} />
          </div>
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Backend notes</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-slate-950">Current contract guardrails</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>The backend expects JWT bearer auth on all protected requests.</li>
            <li>No refresh token or logout API exists, so sign-out is client-side only.</li>
            <li>Profile edits now send complete payloads, including date of birth, to the backend.</li>
          </ul>
          <Link to="/account/security" className="mt-auto">
            <Button className="w-full">Go to security settings</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
