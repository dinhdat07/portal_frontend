import type { UserSummary } from '../auth/types';

export interface ApiErrorPayload {
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface TransportUser {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: UserSummary['role'];
  status: UserSummary['status'];
  created_at: string;
  updated_at: string;
  dob?: string | null;
  email_verified_at?: string | null;
  last_login_at?: string | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
}

export interface PaginatedTransportUsers {
  data: TransportUser[];
  meta: PaginationMeta;
}
