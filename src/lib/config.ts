export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  featureFlags: {
    enableAuditLogs: false,
    enableDashboard: false,
    enableAdminCreateUser: true,
    enableProfileEdit: true,
    enableAdminUserEdit: true,
  },
} as const;
