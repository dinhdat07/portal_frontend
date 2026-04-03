import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { queryClient } from '../../../app/query-client';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { LoadingState } from '../../../components/ui/LoadingState';
import { PageHeader } from '../../../components/ui/PageHeader';
import { getAdminUser, updateAdminUser } from '../../../lib/api/admin-users';
import { getErrorMessage } from '../../../lib/api/errors';
import { queryKeys } from '../../../lib/api/keys';
import { useAuthStore } from '../../../lib/auth/store';
import { getTodayDateInputValue, toDateInputValue } from '../../../lib/date';

const today = getTodayDateInputValue();

const schema = z.object({
  username: z.string().min(3, 'Minimum 3 characters').max(50, 'Maximum 50 characters'),
  firstName: z.string().min(1, 'First name is required').max(100, 'Maximum 100 characters'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Maximum 100 characters'),
  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => value <= today, 'Date of birth cannot be in the future'),
});

type FormValues = z.infer<typeof schema>;

export function AdminUserEditPage() {
  const { userId = '' } = useParams();
  const navigate = useNavigate();
  const currentUserId = useAuthStore((state) => state.session?.user.id);

  const query = useQuery({
    queryKey: queryKeys.adminUser(userId),
    queryFn: () => getAdminUser(userId),
    enabled: Boolean(userId),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    document.title = 'Edit User | Portal Frontend';
  }, []);

  useEffect(() => {
    if (query.data) {
      form.reset({
        username: query.data.username,
        firstName: query.data.firstName,
        lastName: query.data.lastName,
        dob: toDateInputValue(query.data.dob),
      });
    }
  }, [form, query.data]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      updateAdminUser(userId, {
        username: values.username,
        first_name: values.firstName,
        last_name: values.lastName,
        dob: values.dob,
      }),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.adminUser(userId), user);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      navigate(`/admin/users/${user.id}`);
    },
  });

  if (query.isLoading) {
    return <LoadingState label="Loading user..." />;
  }

  if (query.isError) {
    return <Alert tone="danger" description={getErrorMessage(query.error, 'Unable to load user')} />;
  }

  if (query.data?.role === 'admin' && query.data.id !== currentUserId) {
    return (
      <div className="space-y-4">
        <Alert tone="warning" description="Other admin accounts cannot be edited from this screen." />
        <Link to={`/admin/users/${userId}`}>
          <Button variant="secondary">Back to user</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Edit user"
        description="Update this user's profile details."
        actions={
          <Link to={`/admin/users/${userId}`}>
            <Button variant="secondary">Cancel</Button>
          </Link>
        }
      />

      <Card className="p-6">
        <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          {mutation.isError ? (
            <Alert tone="danger" description={getErrorMessage(mutation.error, 'Unable to update user')} />
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="First name" error={form.formState.errors.firstName?.message}>
              <Input {...form.register('firstName')} />
            </Field>
            <Field label="Last name" error={form.formState.errors.lastName?.message}>
              <Input {...form.register('lastName')} />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Username" error={form.formState.errors.username?.message}>
              <Input {...form.register('username')} />
            </Field>
            <Field label="Date of birth" error={form.formState.errors.dob?.message}>
              <Input type="date" max={today} {...form.register('dob')} />
            </Field>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save user'}
            </Button>
            <Link to={`/admin/users/${userId}`}>
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
