import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { queryClient } from '../../../app/query-client';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { PageHeader } from '../../../components/ui/PageHeader';
import { createAdminUser } from '../../../lib/api/admin-users';
import { getErrorMessage } from '../../../lib/api/errors';
import { getTodayDateInputValue } from '../../../lib/date';

const today = getTodayDateInputValue();

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  username: z.string().min(3, 'Minimum 3 characters').max(50, 'Maximum 50 characters'),
  firstName: z.string().min(1, 'First name is required').max(100, 'Maximum 100 characters'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Maximum 100 characters'),
  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => value <= today, 'Date of birth cannot be in the future'),
  role: z.enum(['user', 'admin']),
});

type FormValues = z.infer<typeof schema>;

export function AdminUserCreatePage() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      dob: '',
      role: 'user',
    },
  });

  useEffect(() => {
    document.title = 'Create User | Portal Frontend';
  }, []);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      createAdminUser({
        email: values.email,
        username: values.username,
        first_name: values.firstName,
        last_name: values.lastName,
        dob: values.dob,
        role: values.role,
      }),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      navigate(`/admin/users/${user.id}`);
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Create user"
        description="Create a new user account and choose their role."
        actions={
          <Link to="/admin/users">
            <Button variant="secondary">Cancel</Button>
          </Link>
        }
      />

      <Card className="p-6">
        <div className="mb-5">
          <Alert
            tone="info"
            description="After creation, the user will receive an email to complete account setup."
          />
        </div>
        <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          {mutation.isError ? (
            <Alert tone="danger" description={getErrorMessage(mutation.error, 'Unable to create user')} />
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="First name" error={form.formState.errors.firstName?.message}>
              <Input {...form.register('firstName')} />
            </Field>
            <Field label="Last name" error={form.formState.errors.lastName?.message}>
              <Input {...form.register('lastName')} />
            </Field>
          </div>

          <Field label="Email" error={form.formState.errors.email?.message}>
            <Input type="email" {...form.register('email')} />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Username" error={form.formState.errors.username?.message}>
              <Input {...form.register('username')} />
            </Field>
            <Field label="Date of birth" error={form.formState.errors.dob?.message}>
              <Input type="date" max={today} {...form.register('dob')} />
            </Field>
          </div>

          <Field label="Role" error={form.formState.errors.role?.message}>
            <select className="field-input" {...form.register('role')}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </Field>

          <div className="flex gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create user'}
            </Button>
            <Link to="/admin/users">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
