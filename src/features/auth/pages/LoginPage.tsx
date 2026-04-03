import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { login } from '../../../lib/api/auth';
import { getErrorMessage } from '../../../lib/api/errors';
import { useAuthStore } from '../../../lib/auth/store';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';

const schema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session);
      const next = location.state?.from;
      navigate(typeof next === 'string' ? next : '/account/profile', { replace: true });
    },
  });

  useEffect(() => {
    document.title = 'Login | Portal Frontend';
  }, []);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Authentication</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">Sign in to the portal</h2>
        <p className="mt-2 text-sm text-slate-600">Welcome back. Sign in to continue to your account.</p>
      </div>

      <form
        className="space-y-5 px-6 py-6 sm:px-8"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        {mutation.isError ? (
          <Alert tone="danger" description={getErrorMessage(mutation.error, 'Unable to sign in')} />
        ) : null}

        <Field label="Email or username" error={form.formState.errors.identifier?.message}>
          <Input placeholder="ada@example.com" {...form.register('identifier')} />
        </Field>

        <Field label="Password" error={form.formState.errors.password?.message}>
          <Input type="password" placeholder="Enter your password" {...form.register('password')} />
        </Field>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="flex justify-start text-sm">
          <Link className="font-semibold text-cobalt-600 hover:text-cobalt-500" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <p className="text-center text-sm text-slate-600">
          Need an account?{' '}
          <Link className="font-semibold text-cobalt-600 hover:text-cobalt-500" to="/register">
            Register here
          </Link>
        </p>
      </form>
    </Card>
  );
}
