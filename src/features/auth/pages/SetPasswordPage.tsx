import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { getErrorMessage } from '../../../lib/api/errors';
import { setPassword } from '../../../lib/api/auth';

const schema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Minimum 8 characters').max(255, 'Maximum 255 characters'),
    confirmPassword: z.string().min(8, 'Minimum 8 characters').max(255, 'Maximum 255 characters'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password confirmation does not match',
  });

type FormValues = z.infer<typeof schema>;

export function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get('token') || '';
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: useMemo(
      () => ({
        token: tokenFromQuery,
        password: '',
        confirmPassword: '',
      }),
      [tokenFromQuery],
    ),
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      setPassword({
        token: values.token,
        password: values.password,
        confirm_password: values.confirmPassword,
      }),
    onSuccess: (response) => {
      setSuccessMessage(response.message);
    },
  });

  useEffect(() => {
    document.title = 'Set Password | Portal Frontend';
  }, []);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Initial password</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">Set your password</h2>
        <p className="mt-2 text-sm text-slate-600">Use the backend password-set flow after receiving a setup email from registration or an admin-created account.</p>
      </div>

      <form
        className="space-y-5 px-6 py-6 sm:px-8"
        onSubmit={form.handleSubmit((values) => {
          setSuccessMessage(null);
          mutation.mutate(values);
        })}
      >
        {mutation.isError ? (
          <Alert tone="danger" description={getErrorMessage(mutation.error, 'Unable to set password')} />
        ) : null}
        {successMessage ? <Alert tone="success" description={successMessage} /> : null}

        <Field label="Token" error={form.formState.errors.token?.message}>
          <Input placeholder="Paste your token" {...form.register('token')} />
        </Field>

        <Field label="Password" error={form.formState.errors.password?.message}>
          <Input type="password" {...form.register('password')} />
        </Field>

        <Field label="Confirm password" error={form.formState.errors.confirmPassword?.message}>
          <Input type="password" {...form.register('confirmPassword')} />
        </Field>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Set password'}
        </Button>

        <p className="text-center text-sm text-slate-600">
          Already set it?{' '}
          <Link className="font-semibold text-cobalt-600 hover:text-cobalt-500" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </Card>
  );
}
