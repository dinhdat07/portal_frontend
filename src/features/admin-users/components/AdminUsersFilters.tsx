import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';

export interface AdminUsersFilterValues {
  username: string;
  email: string;
  fullName: string;
  role: '' | 'user' | 'admin';
  status: '' | 'active' | 'pending_verification' | 'deleted';
  includeDeleted: boolean;
}

interface AdminUsersFiltersProps {
  initialValues: AdminUsersFilterValues;
  onSubmit: (values: AdminUsersFilterValues) => void;
  onReset: () => void;
}

export function AdminUsersFilters({ initialValues, onSubmit, onReset }: AdminUsersFiltersProps) {
  const form = useForm<AdminUsersFilterValues>({
    values: initialValues,
  });

  return (
    <Card className="p-6">
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Username">
            <Input placeholder="Search username" {...form.register('username')} />
          </Field>
          <Field label="Email">
            <Input placeholder="Search email" {...form.register('email')} />
          </Field>
          <Field label="Full name">
            <Input placeholder="Search full name" {...form.register('fullName')} />
          </Field>
          <Field label="Role">
            <select className="field-input" {...form.register('role')}>
              <option value="">All roles</option>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </Field>
          <Field label="Status">
            <select className="field-input" {...form.register('status')}>
              <option value="">All statuses</option>
              <option value="active">active</option>
              <option value="pending_verification">pending_verification</option>
              <option value="deleted">deleted</option>
            </select>
          </Field>
          <label className="flex items-end">
            <span className="flex w-full items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...form.register('includeDeleted')} />
              Include deleted users
            </span>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">Apply filters</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset({
                username: '',
                email: '',
                fullName: '',
                role: '',
                status: '',
                includeDeleted: false,
              });
              onReset();
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
