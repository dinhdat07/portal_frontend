export const queryKeys = {
  me: ['me'] as const,
  adminUsers: (search: string) => ['admin-users', search] as const,
  adminUser: (userId: string) => ['admin-user', userId] as const,
};
