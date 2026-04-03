# Portal Frontend

React frontend for the Portal system, focused on authentication, profile management, and admin user management.

## What this repo does

- Public auth flows: login, register, verify email, resend verification, forgot/reset password, set password
- Protected account flows: profile view/edit, password change
- Admin flows: user list, create, detail, edit, delete/restore, role update

## Tech stack

- Vite + React + TypeScript
- React Router
- TanStack Query
- Zustand
- React Hook Form + Zod
- Tailwind CSS
- Vitest + Testing Library

## Folder structure

```text
portal_frontend/
├─ src/
│  ├─ app/                      # App-level router/providers/query client
│  ├─ components/
│  │  ├─ layout/                # Layouts and route guards
│  │  └─ ui/                    # Shared UI components
│  ├─ features/
│  │  ├─ auth/                  # Auth pages
│  │  ├─ profile/               # Profile pages
│  │  └─ admin-users/           # Admin users pages/components
│  ├─ lib/
│  │  ├─ api/                   # API client, endpoints, mappers, query keys
│  │  ├─ auth/                  # Session storage + auth store
│  │  ├─ config.ts              # Runtime flags + API base URL
│  │  └─ utils/date helpers
│  ├─ test/
│  │  └─ setup.ts               # Vitest setup
│  ├─ main.tsx                  # App bootstrap
│  └─ styles.css
├─ vite.config.ts
├─ tailwind.config.ts
└─ package.json
```

## Architecture

This project uses a feature-oriented UI structure with a shared application core:

1. `app/`: global wiring (router, providers, query client)
2. `features/`: domain-specific pages/components by business area
3. `lib/api/`: typed API layer and request helpers
4. `lib/auth/`: session persistence + auth state management
5. `components/ui`: reusable visual primitives

Request flow:
`Page -> feature hook/call -> lib/api client -> backend /api/v1`

## Prerequisites

- Node.js 20+
- npm 10+
- Backend API running at `http://localhost:8000`

## Environment variables

1. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

2. Default values:

```env
VITE_API_BASE_URL=/api/v1
VITE_DEV_PROXY_TARGET=http://host.docker.internal:8000
```

Note: the current Vite proxy target is hardcoded in `vite.config.ts` to `http://host.docker.internal:8000`.

## Setup and run (step-by-step)

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open app:

- `http://localhost:5173`

## Build, preview, test

1. Build production bundle:

```bash
npm run build
```

2. Preview production build locally:

```bash
npm run preview
```

3. Run tests:

```bash
npm run test
```

## Feature flags

Feature flags live in `src/lib/config.ts`:

- `enableAuditLogs`
- `enableDashboard`
- `enableAdminCreateUser`
- `enableProfileEdit`
- `enableAdminUserEdit`
