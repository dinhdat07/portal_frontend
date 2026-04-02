import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminUserDetailPage } from '../features/admin-users/pages/AdminUserDetailPage';
import { AdminUserEditPage } from '../features/admin-users/pages/AdminUserEditPage';
import { AdminUserCreatePage } from '../features/admin-users/pages/AdminUserCreatePage';
import { AdminUsersPage } from '../features/admin-users/pages/AdminUsersPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ResendVerificationPage } from '../features/auth/pages/ResendVerificationPage';
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage';
import { SetPasswordPage } from '../features/auth/pages/SetPasswordPage';
import { VerifyEmailPage } from '../features/auth/pages/VerifyEmailPage';
import { ProfilePage } from '../features/profile/pages/ProfilePage';
import { ProfileEditPage } from '../features/profile/pages/ProfileEditPage';
import { SecurityPage } from '../features/profile/pages/SecurityPage';
import { FeatureUnavailablePage } from '../components/ui/FeatureUnavailablePage';
import { RequireAdmin, RequireAuth, RedirectIfAuthenticated } from '../components/layout/guards';
import { config } from '../lib/config';

function IndexRedirect() {
  return <Navigate to="/account/profile" replace />;
}

const router = createBrowserRouter([
  {
    element: (
      <RedirectIfAuthenticated>
        <PublicLayout />
      </RedirectIfAuthenticated>
    ),
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify-email', element: <VerifyEmailPage /> },
      { path: '/resend-verification', element: <ResendVerificationPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/auth/reset-password', element: <ResetPasswordPage /> },
      { path: '/set-password', element: <SetPasswordPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <IndexRedirect /> },
      { path: 'account/profile', element: <ProfilePage /> },
      { path: 'account/security', element: <SecurityPage /> },
      {
        path: 'account/profile/edit',
        element: config.featureFlags.enableProfileEdit ? (
          <ProfileEditPage />
        ) : (
          <FeatureUnavailablePage
            title="Profile editing is disabled"
            description="The backend currently omits date-of-birth from the profile response and can reject partial updates. This screen stays hidden until that contract is fixed."
          />
        ),
      },
      {
        path: 'admin',
        element: (
          <RequireAdmin>
            <Outlet />
          </RequireAdmin>
        ),
        children: [
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'users/:userId', element: <AdminUserDetailPage /> },
          {
            path: 'users/:userId/edit',
            element: config.featureFlags.enableAdminUserEdit ? (
              <AdminUserEditPage />
            ) : (
              <FeatureUnavailablePage
                title="User editing is disabled"
                description="This screen stays hidden until the backend supports it safely."
              />
            ),
          },
          {
            path: 'users/new',
            element: config.featureFlags.enableAdminCreateUser ? (
              <AdminUserCreatePage />
            ) : (
              <FeatureUnavailablePage
                title="User creation is disabled"
                description="The current backend implementation creates admin-managed users unreliably, so this screen remains disabled until the backend contract is corrected."
              />
            ),
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
