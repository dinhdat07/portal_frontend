import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { resendVerification } from '../../../lib/api/auth';
import { getErrorMessage } from '../../../lib/api/errors';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

type FormValues = z.infer<typeof schema>;

export function ResendVerificationPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const mutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: (response) => {
      setSuccessMessage(response.message);
    },
  });

  useEffect(() => {
    document.title = 'Resend Verification | Portal Frontend';
  }, []);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Verification</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">Resend verification email</h2>
        <p className="mt-2 text-sm text-slate-600">Did not get the first email? Enter your address and we will send it again.</p>
      </div>

      <form
        className="space-y-5 px-6 py-6 sm:px-8"
        onSubmit={form.handleSubmit((values) => {
          setSuccessMessage(null);
          mutation.mutate(values);
        })}
      >
        {mutation.isError ? (
          <Alert tone="danger" description={getErrorMessage(mutation.error, 'Unable to resend verification')} />
        ) : null}
        {successMessage ? <Alert tone="success" description={successMessage} /> : null}

        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" placeholder="ada@example.com" {...form.register('email')} />
        </Field>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Sending...' : 'Resend verification'}
        </Button>

        <p className="text-center text-sm text-slate-600">
          Already verified?{' '}
          <Link className="font-semibold text-cobalt-600 hover:text-cobalt-500" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </Card>
  );
}
