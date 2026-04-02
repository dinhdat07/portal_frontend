import type { UserSummary } from '../auth/types';
import type { PaginationMeta, TransportUser } from './types';

export function mapUser(transport: TransportUser): UserSummary {
  return {
    id: transport.id,
    email: transport.email,
    username: transport.username,
    firstName: transport.first_name,
    lastName: transport.last_name,
    role: transport.role,
    status: transport.status,
    createdAt: transport.created_at,
    updatedAt: transport.updated_at,
    dob: transport.dob ?? null,
    emailVerifiedAt: transport.email_verified_at ?? null,
    lastLoginAt: transport.last_login_at ?? null,
    deletedAt: transport.deleted_at ?? null,
    deletedBy: transport.deleted_by ?? null,
  };
}

export interface PaginatedUsers {
  data: UserSummary[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export function mapPagination(meta: PaginationMeta) {
  return {
    page: meta.page,
    pageSize: meta.page_size,
    total: meta.total,
  };
}
