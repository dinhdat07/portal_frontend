import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/auth/store';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const navItems = [
  { to: '/account/profile', label: 'Profile' },
  { to: '/account/security', label: 'Security' },
  { to: '/admin/users', label: 'Admin Users', adminOnly: true },
];

export function AppLayout() {
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();

  if (!session) {
    return null;
  }

  const items = navItems.filter((item) => !item.adminOnly || session.user.role === 'admin');

  return (
    <div className="min-h-screen px-4 py-4 md:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="panel flex flex-col gap-8 p-5">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Portal</p>
              <h1 className="font-display text-2xl font-semibold text-slate-950">Frontend Console</h1>
            </div>
            <p className="text-sm text-slate-600">Backend-safe React client for account and admin user management.</p>
          </div>

          <nav className="space-y-2">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn('nav-link', isActive && 'nav-link-active')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white">
            <p className="text-sm font-semibold">{session.user.firstName} {session.user.lastName}</p>
            <p className="mt-1 text-sm text-white/70">{session.user.email}</p>
            <div className="mt-4 flex items-center justify-between">
              <Badge tone="accent">{session.user.role}</Badge>
              <Button
                variant="secondary"
                className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                onClick={() => {
                  clearSession();
                  navigate('/login');
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        </aside>

        <div className="panel min-h-[calc(100vh-2rem)] p-4 md:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Operations</p>
              <h2 className="font-display text-2xl font-semibold text-slate-950">Portal Workspace</h2>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
              Safe-mode UI: unsupported backend routes stay out of navigation.
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
