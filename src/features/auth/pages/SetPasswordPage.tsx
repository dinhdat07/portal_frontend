import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get('token') || '';

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
    onSuccess: () => {
      navigate('/login', { replace: true });
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
        <p className="mt-2 text-sm text-slate-600">Create your password to finish setting up your account.</p>
      </div>

      <form
        className="space-y-5 px-6 py-6 sm:px-8"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        {mutation.isError ? (
          <Alert tone="danger" description={getErrorMessage(mutation.error, 'Unable to set password')} />
        ) : null}

        <input type="hidden" {...form.register('token')} />

        <Field label="Password" error={form.formState.errors.password?.message}>
          <Input type="password" {...form.register('password')} />
        </Field>

        <Field label="Confirm password" error={form.formState.errors.confirmPassword?.message}>
          <Input type="password" {...form.register('confirmPassword')} />
        </Field>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Set password'}
        </Button>
      </form>
    </Card>
  );
}
