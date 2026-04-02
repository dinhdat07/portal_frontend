# Portal Frontend

React frontend for the `portal_backend` API.

## Stack

- Vite + React + TypeScript
- React Router
- TanStack Query
- Zustand
- React Hook Form + Zod
- Tailwind CSS

## Run

```bash
npm install
npm run dev
```

By default the frontend calls `/api/v1` and proxies `/api/*` to `http://localhost:8000` during development.

## Build

```bash
npm run build
npm run test
```

## Current backend-safe scope

- Register
- Login
- Verify email
- Resend verification
- Forgot password
- Reset password
- Set password
- Profile read
- Profile edit
- Password change
- Admin user list
- Admin user create
- Admin user detail
- Admin user edit
- Admin role update
- Admin delete / restore

## Intentionally disabled

- Logout API call
- Audit logs
- Dashboard summary

These stay hidden because the current backend either does not expose the routes in the Gin router or does not behave safely enough for the UI to rely on yet.
