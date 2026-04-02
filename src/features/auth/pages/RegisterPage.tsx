import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { register } from '../../../lib/api/auth';
import { getErrorMessage } from '../../../lib/api/errors';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  username: z.string().min(3, 'Minimum 3 characters').max(50, 'Maximum 50 characters'),
  firstName: z.string().min(1, 'First name is required').max(100, 'Maximum 100 characters'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Maximum 100 characters'),
  password: z.string().min(8, 'Minimum 8 characters').max(255, 'Maximum 255 characters'),
  dob: z.string().min(1, 'Date of birth is required'),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      dob: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      register({
        email: values.email,
        username: values.username,
        first_name: values.firstName,
        last_name: values.lastName,
        password: values.password,
        dob: values.dob,
      }),
    onSuccess: (response) => {
      setSuccessMessage(response.message);
      form.reset();
    },
  });

  useEffect(() => {
    document.title = 'Register | Portal Frontend';
  }, []);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Create account</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">Register for access</h2>
        <p className="mt-2 text-sm text-slate-600">The backend sends a verification email after registration. Use the verification and resend flows from the auth section if needed.</p>
      </div>

      <form
        className="space-y-5 px-6 py-6 sm:px-8"
        onSubmit={form.handleSubmit((values) => {
          setSuccessMessage(null);
          mutation.mutate(values);
        })}
      >
        {mutation.isError ? (
          <Alert tone="danger" description={getErrorMessage(mutation.error, 'Unable to register')} />
        ) : null}
        {successMessage ? <Alert tone="success" description={successMessage} /> : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First name" error={form.formState.errors.firstName?.message}>
            <Input placeholder="Ada" {...form.register('firstName')} />
          </Field>
          <Field label="Last name" error={form.formState.errors.lastName?.message}>
            <Input placeholder="Lovelace" {...form.register('lastName')} />
          </Field>
        </div>

        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" placeholder="ada@example.com" {...form.register('email')} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Username" error={form.formState.errors.username?.message}>
            <Input placeholder="ada" {...form.register('username')} />
          </Field>
          <Field label="Date of birth" error={form.formState.errors.dob?.message}>
            <Input type="date" {...form.register('dob')} />
          </Field>
        </div>

        <Field label="Password" error={form.formState.errors.password?.message}>
          <Input type="password" placeholder="Create a strong password" {...form.register('password')} />
        </Field>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating account...' : 'Create account'}
        </Button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-semibold text-cobalt-600 hover:text-cobalt-500" to="/login">
            Sign in
          </Link>
        </p>
        <p className="text-center text-sm text-slate-600">
          Need another email?{' '}
          <Link className="font-semibold text-cobalt-600 hover:text-cobalt-500" to="/resend-verification">
            Resend verification
          </Link>
        </p>
      </form>
    </Card>
  );
}
