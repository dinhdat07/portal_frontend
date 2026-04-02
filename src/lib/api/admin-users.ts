import type { UserRole, UserStatus } from '../auth/types';
import { mapPagination, mapUser, type PaginatedUsers } from './mappers';
import { request } from './client';
import type { PaginatedTransportUsers, TransportUser } from './types';

export interface UserFilters {
  page: number;
  pageSize: number;
  username?: string;
  email?: string;
  fullName?: string;
  dob?: string;
  role?: UserRole | '';
  status?: UserStatus | '';
  includeDeleted?: boolean;
}

interface AdminUserPayload {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
  role?: UserRole;
}

function buildQuery(filters: UserFilters) {
  const params = new URLSearchParams();
  params.set('page', String(filters.page));
  params.set('page_size', String(filters.pageSize));

  if (filters.username) params.set('username', filters.username);
  if (filters.email) params.set('email', filters.email);
  if (filters.fullName) params.set('full_name', filters.fullName);
  if (filters.dob) params.set('dob', filters.dob);
  if (filters.role) params.set('role', filters.role);
  if (filters.status) params.set('status', filters.status);
  if (filters.includeDeleted) params.set('include_deleted', 'true');

  return params.toString();
}

export async function getAdminUsers(filters: UserFilters): Promise<PaginatedUsers> {
  const query = buildQuery(filters);
  const response = await request<PaginatedTransportUsers>(`/admin/users?${query}`);
  return {
    data: response.data.map(mapUser),
    meta: mapPagination(response.meta),
  };
}

export async function getAdminUser(userId: string) {
  const response = await request<TransportUser>(`/admin/users/${userId}`);
  return mapUser(response);
}

export async function createAdminUser(payload: Required<Pick<AdminUserPayload, 'email' | 'username' | 'first_name' | 'last_name' | 'dob' | 'role'>>) {
  const response = await request<TransportUser>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapUser(response);
}

export async function updateAdminUser(
  userId: string,
  payload: Required<Pick<AdminUserPayload, 'username' | 'first_name' | 'last_name' | 'dob'>>,
) {
  const response = await request<TransportUser>(`/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return mapUser(response);
}

export async function updateAdminUserRole(userId: string, role: UserRole) {
  const response = await request<TransportUser>(`/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
  return mapUser(response);
}

export async function deleteAdminUser(userId: string) {
  const response = await request<TransportUser>(`/admin/users/${userId}/delete`, {
    method: 'DELETE',
  });
  return mapUser(response);
}

export async function restoreAdminUser(userId: string) {
  const response = await request<TransportUser>(`/admin/users/${userId}/restore`, {
    method: 'PUT',
  });
  return mapUser(response);
}
