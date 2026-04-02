import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { verifyEmail } from '../../../lib/api/auth';
import { getErrorMessage } from '../../../lib/api/errors';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const mutation = useMutation({
    mutationFn: verifyEmail,
  });

  useEffect(() => {
    document.title = 'Verify Email | Portal Frontend';
  }, []);

  useEffect(() => {
    if (token && mutation.status === 'idle') {
      mutation.mutate({ token });
    }
  }, [mutation, token]);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Email verification</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">Verify your account</h2>
        <p className="mt-2 text-sm text-slate-600">This page posts the token from your email to the backend verification endpoint.</p>
      </div>

      <div className="space-y-5 px-6 py-6 sm:px-8">
        {!token ? (
          <Alert tone="warning" description="No verification token was found in the URL." />
        ) : null}

        {token && mutation.isPending ? (
          <Alert tone="info" description="Verifying your email..." />
        ) : null}

        {mutation.isSuccess ? (
          <Alert tone="success" description={mutation.data.message} />
        ) : null}

        {mutation.isError ? (
          <Alert tone="danger" description={getErrorMessage(mutation.error, 'Unable to verify email')} />
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/login" className="sm:flex-1">
            <Button className="w-full">Go to sign in</Button>
          </Link>
          <Link to="/resend-verification" className="sm:flex-1">
            <Button variant="secondary" className="w-full">
              Resend verification
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
