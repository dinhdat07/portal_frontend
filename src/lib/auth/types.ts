export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'pending_verification' | 'deleted';

export interface UserSummary {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  dob?: string | null;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  deletedAt?: string | null;
  deletedBy?: string | null;
}

export interface AuthSession {
  accessToken: string;
  expiresAt: string;
  user: UserSummary;
}
