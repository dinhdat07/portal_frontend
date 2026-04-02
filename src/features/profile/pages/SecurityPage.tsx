import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { PageHeader } from '../../../components/ui/PageHeader';
import { getErrorMessage } from '../../../lib/api/errors';
import { changeMyPassword } from '../../../lib/api/users';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Minimum 8 characters').max(255, 'Maximum 255 characters'),
    confirmPassword: z.string().min(8, 'Minimum 8 characters').max(255, 'Maximum 255 characters'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password confirmation does not match',
  });

type FormValues = z.infer<typeof schema>;

export function SecurityPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      changeMyPassword({
        current_password: values.currentPassword,
        new_password: values.newPassword,
        confirm_new_password: values.confirmPassword,
      }),
    onSuccess: (response) => {
      setSuccessMessage(response.message);
      form.reset();
    },
  });

  useEffect(() => {
    document.title = 'Security | Portal Frontend';
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Security settings"
        description="Change your password against the current backend contract."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="p-6">
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit((values) => {
              setSuccessMessage(null);
              mutation.mutate(values);
            })}
          >
            {mutation.isError ? (
              <Alert tone="danger" description={getErrorMessage(mutation.error, 'Unable to change password')} />
            ) : null}
            {successMessage ? <Alert tone="success" description={successMessage} /> : null}

            <Field label="Current password" error={form.formState.errors.currentPassword?.message}>
              <Input type="password" {...form.register('currentPassword')} />
            </Field>
            <Field label="New password" error={form.formState.errors.newPassword?.message}>
              <Input type="password" {...form.register('newPassword')} />
            </Field>
            <Field label="Confirm new password" error={form.formState.errors.confirmPassword?.message}>
              <Input type="password" {...form.register('confirmPassword')} />
            </Field>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Update password'}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold text-slate-950">Security notes</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Backend validation requires a minimum password length of 8 characters.</li>
            <li>The current password must be correct, otherwise the API returns a conflict error.</li>
            <li>Session refresh is not supported, so expired tokens redirect back to login.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
