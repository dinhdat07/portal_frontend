export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  csrfCookieName: import.meta.env.VITE_CSRF_COOKIE_NAME || 'portal_csrf_token',
  csrfHeaderName: import.meta.env.VITE_CSRF_HEADER_NAME || 'X-CSRF-Token',
  featureFlags: {
    enableAuditLogs: false,
    enableDashboard: false,
    enableAdminCreateUser: true,
    enableProfileEdit: true,
    enableAdminUserEdit: true,
  },
} as const;
