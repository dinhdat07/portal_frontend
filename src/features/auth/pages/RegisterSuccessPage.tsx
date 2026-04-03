import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { resendVerification } from '../../../lib/api/auth';
import { getErrorMessage } from '../../../lib/api/errors';

export function RegisterSuccessPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const mutation = useMutation({
    mutationFn: resendVerification,
  });

  useEffect(() => {
    document.title = 'Check Your Email | Portal Frontend';
  }, []);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Registration complete</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">Check your email</h2>
        <p className="mt-2 text-sm text-slate-600">
          We sent a verification email{email ? ` to ${email}` : ''}. Open that message to activate your account.
        </p>
      </div>

      <div className="space-y-5 px-6 py-6 sm:px-8">
        {email ? (
          <Alert
            tone="info"
            description="If the message does not arrive, you can resend the verification email from this page."
          />
        ) : (
          <Alert
            tone="warning"
            description="The email address was not available. Use the resend page if you need another verification email."
          />
        )}

        {mutation.isSuccess ? <Alert tone="success" description={mutation.data.message} /> : null}
        {mutation.isError ? (
          <Alert tone="danger" description={getErrorMessage(mutation.error, 'Unable to resend verification')} />
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="sm:flex-1"
            disabled={!email || mutation.isPending}
            onClick={() => mutation.mutate({ email })}
          >
            {mutation.isPending ? 'Sending...' : 'Resend verification'}
          </Button>
          <Link to="/login" className="sm:flex-1">
            <Button variant="secondary" className="w-full">
              Back to sign in
            </Button>
          </Link>
        </div>

        {!email ? (
          <p className="text-center text-sm text-slate-600">
            Need to enter an email manually?{' '}
            <Link className="font-semibold text-cobalt-600 hover:text-cobalt-500" to="/resend-verification">
              Open resend page
            </Link>
          </p>
        ) : null}
      </div>
    </Card>
  );
}
