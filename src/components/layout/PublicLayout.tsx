import { Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-hero">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="hidden rounded-[2rem] bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Portal System
            </span>
            <div className="space-y-4">
              <h1 className="max-w-lg font-display text-5xl font-semibold tracking-tight">
                Manage your account and team access in one place.
              </h1>
              <p className="max-w-xl text-base text-white/70">
                Sign in, update your profile, and manage users with a clean and simple workflow.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold">Simple account tools</p>
              <p className="mt-2 text-sm text-white/70">Create your account, verify email, and keep your profile up to date.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold">Built for admins</p>
              <p className="mt-2 text-sm text-white/70">Search users, review details, and manage access safely.</p>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
